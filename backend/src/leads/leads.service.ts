import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, QueryFilter } from 'mongoose';

import { CreateLeadDto } from './dto/create-lead.dto';
import { MetaConversionsService } from './meta-conversions.service';
import { Lead, LeadDocument, LeadStage } from './schemas/lead.schema';

export interface LeadRequestContext {
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Qué evento estándar de Meta corresponde a cada etapa. Tienen que ser
 * estándar (no `trackCustom`) para que el trafficker pueda optimizar la
 * campaña por ellos sin crear conversiones personalizadas:
 * `Lead` es "Cliente potencial" y `CompleteRegistration` "Registro completado".
 */
const STAGE_EVENTS: Partial<Record<LeadStage, string>> = {
  [LeadStage.WhatsappJoined]: 'Lead',
  [LeadStage.Registered]: 'CompleteRegistration',
};

const EVENT_CONTENT_NAME = 'Webinar Método OPORTUNO';

export interface StageEventInput {
  /** Mismo ID que el evento del pixel del navegador, para que Meta deduplique. */
  eventId?: string;
  eventSourceUrl?: string;
}

export interface LeadFilters {
  campaign?: string;
  /** Fecha calendario "YYYY-MM-DD"; se incluye desde el inicio de ese día. */
  dateFrom?: string;
  /** Fecha calendario "YYYY-MM-DD"; se incluye hasta el final de ese día. */
  dateTo?: string;
  /** Deja solo los que se inscribieron más de una vez. */
  onlyReturning?: boolean;
}

/** `submissions` ordena por interés: más inscripciones primero. */
export type LeadSort = 'recent' | 'submissions';

const SORT_ORDERS: Record<LeadSort, Record<string, 1 | -1>> = {
  recent: { createdAt: -1 },
  // Desempata por fecha para que el orden sea estable entre páginas.
  submissions: { submissionCount: -1, createdAt: -1 },
};

export interface PublicLead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneE164: string;
  stage: LeadStage;
  createdAt: Date;
}

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    @InjectModel(Lead.name) private readonly leadModel: Model<LeadDocument>,
    private readonly metaConversions: MetaConversionsService,
  ) {}

  async create(
    dto: CreateLeadDto,
    context: LeadRequestContext = {},
  ): Promise<PublicLead> {
    const lead = await this.upsertByEmail(dto, context);

    this.logger.log(
      `Lead capturado: ${lead.email} (${lead.phoneE164}) · inscripción #${lead.submissionCount}`,
    );
    return this.toPublicLead(lead);
  }

  /**
   * Un correo, una ficha: si ya existe se actualizan sus datos con los del
   * último envío y se suma una inscripción al historial.
   *
   * El `upsert` sobre un índice único tiene una carrera conocida: dos envíos
   * simultáneos del mismo correo pueden no ver el documento del otro y ambos
   * intentar insertar; el segundo revienta con E11000. Como para entonces el
   * documento ya existe, reintentar una vez resuelve.
   */
  private async upsertByEmail(
    dto: CreateLeadDto,
    context: LeadRequestContext,
    isRetry = false,
  ): Promise<LeadDocument> {
    const phoneE164 = `${dto.dialCode}${dto.phoneNumber}`;
    const now = new Date();

    try {
      return await this.leadModel.findOneAndUpdate(
        { email: dto.email },
        {
          $set: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            countryCode: dto.countryCode,
            dialCode: dto.dialCode,
            phoneNumber: dto.phoneNumber,
            phoneE164,
            lastSubmittedAt: now,
            ipAddress: context.ipAddress,
            userAgent: context.userAgent,
            ...(dto.tracking ? { tracking: dto.tracking } : {}),
          },
          $inc: { submissionCount: 1 },
          $push: {
            submissions: { at: now, phoneE164, tracking: dto.tracking ?? {} },
          },
          $setOnInsert: { stage: LeadStage.Captured },
        },
        {
          returnDocument: 'after',
          upsert: true,
          setDefaultsOnInsert: true,
        },
      );
    } catch (error) {
      if (isRetry || !this.isDuplicateKeyError(error)) throw error;
      return this.upsertByEmail(dto, context, true);
    }
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      (error as { code?: number }).code === 11000
    );
  }

  async updateStage(
    id: string,
    stage: LeadStage,
    event: StageEventInput = {},
    context: LeadRequestContext = {},
  ): Promise<PublicLead> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Lead no encontrado');
    }

    const timestamps: Partial<Record<keyof Lead, Date>> = {};
    if (stage === LeadStage.WhatsappJoined)
      timestamps.whatsappJoinedAt = new Date();
    if (stage === LeadStage.Registered) timestamps.registeredAt = new Date();

    const lead = await this.leadModel.findByIdAndUpdate(
      id,
      { $set: { stage, ...timestamps } },
      { returnDocument: 'after' },
    );

    if (!lead) throw new NotFoundException('Lead no encontrado');

    const eventName = STAGE_EVENTS[stage];
    if (eventName) {
      // No se espera ni se propaga el error: el pixel/CAPI nunca debe romper
      // el flujo real del lead uniéndose al grupo.
      void this.metaConversions.sendEvent({
        eventName,
        /*
          Sin eventId del navegador se cae al id del lead, pero mezclado con el
          nombre del evento: si no, `Lead` y `CompleteRegistration` del mismo
          lead compartirían ID y Meta descartaría uno como duplicado.
        */
        eventId: event.eventId ?? `${lead._id.toString()}-${eventName}`,
        email: lead.email,
        phoneE164: lead.phoneE164,
        firstName: lead.firstName,
        lastName: lead.lastName,
        countryCode: lead.countryCode,
        fbp: lead.tracking?.fbp,
        fbc: lead.tracking?.fbc,
        fbclid: lead.tracking?.fbclid,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        eventSourceUrl: event.eventSourceUrl,
        customData: { content_name: EVENT_CONTENT_NAME },
      });
    }

    return this.toPublicLead(lead);
  }

  async findAll(
    page = 1,
    limit = 25,
    filters: LeadFilters = {},
    sort: LeadSort = 'recent',
  ) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const filter = this.buildFilter(filters);

    const [items, total] = await Promise.all([
      this.leadModel
        .find(filter)
        .sort(SORT_ORDERS[sort] ?? SORT_ORDERS.recent)
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .lean()
        .exec(),
      this.leadModel.countDocuments(filter),
    ]);

    return { items, total, page: safePage, limit: safeLimit };
  }

  /** Trae todos los leads sin paginar, para exportar a CSV/Excel/PDF. */
  async findAllForExport(filters: LeadFilters = {}, sort: LeadSort = 'recent') {
    return this.leadModel
      .find(this.buildFilter(filters))
      .sort(SORT_ORDERS[sort] ?? SORT_ORDERS.recent)
      .lean()
      .exec();
  }

  /**
   * Campañas distintas ya vistas en los leads, más recientes primero. La
   * primera de la lista es "la campaña actual" para el filtro por defecto
   * del dashboard.
   */
  async findCampaigns() {
    return this.leadModel.aggregate<{
      campaign: string;
      count: number;
      lastSeenAt: Date;
    }>([
      {
        $match: {
          'tracking.utm_campaign': { $exists: true, $ne: '' },
        },
      },
      {
        $group: {
          _id: '$tracking.utm_campaign',
          count: { $sum: 1 },
          lastSeenAt: { $max: '$createdAt' },
        },
      },
      { $sort: { lastSeenAt: -1 } },
      {
        $project: {
          _id: 0,
          campaign: '$_id',
          count: 1,
          lastSeenAt: 1,
        },
      },
    ]);
  }

  private buildFilter(filters: LeadFilters): QueryFilter<Lead> {
    const filter: QueryFilter<Lead> = {};

    if (filters.campaign) {
      filter['tracking.utm_campaign'] = filters.campaign;
    }

    // Los leads previos a esta función no tienen `submissionCount`, así que
    // "más de una vez" se pregunta explícitamente por > 1, no por != 1.
    if (filters.onlyReturning) {
      filter.submissionCount = { $gt: 1 };
    }

    if (filters.dateFrom || filters.dateTo) {
      const createdAt: { $gte?: Date; $lt?: Date } = {};
      if (filters.dateFrom) createdAt.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) {
        const exclusiveEnd = new Date(filters.dateTo);
        exclusiveEnd.setDate(exclusiveEnd.getDate() + 1);
        createdAt.$lt = exclusiveEnd;
      }
      filter.createdAt = createdAt;
    }

    return filter;
  }

  async stats() {
    const [grouped, returning] = await Promise.all([
      this.leadModel.aggregate<{
        _id: LeadStage;
        count: number;
      }>([{ $group: { _id: '$stage', count: { $sum: 1 } } }]),
      this.leadModel.countDocuments({ submissionCount: { $gt: 1 } }),
    ]);

    const byStage = Object.values(LeadStage).reduce<Record<string, number>>(
      (acc, stage) => ({ ...acc, [stage]: 0 }),
      {},
    );
    grouped.forEach(({ _id, count }) => {
      byStage[_id] = count;
    });

    const total = Object.values(byStage).reduce((sum, count) => sum + count, 0);
    /** `returning` = leads que enviaron el formulario más de una vez. */
    return { total, byStage, returning };
  }

  private toPublicLead(lead: LeadDocument): PublicLead {
    return {
      id: lead._id.toString(),
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phoneE164: lead.phoneE164,
      stage: lead.stage,
      createdAt: lead.createdAt,
    };
  }
}
