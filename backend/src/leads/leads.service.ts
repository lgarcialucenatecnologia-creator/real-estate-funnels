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

export interface LeadFilters {
  campaign?: string;
  /** Fecha calendario "YYYY-MM-DD"; se incluye desde el inicio de ese día. */
  dateFrom?: string;
  /** Fecha calendario "YYYY-MM-DD"; se incluye hasta el final de ese día. */
  dateTo?: string;
}

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
    const phoneE164 = `${dto.dialCode}${dto.phoneNumber}`;

    const lead = await this.leadModel.findOneAndUpdate(
      { email: dto.email, phoneE164 },
      {
        $set: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          countryCode: dto.countryCode,
          dialCode: dto.dialCode,
          phoneNumber: dto.phoneNumber,
          phoneE164,
          ipAddress: context.ipAddress,
          userAgent: context.userAgent,
          ...(dto.tracking ? { tracking: dto.tracking } : {}),
        },
        $setOnInsert: { stage: LeadStage.Captured },
      },
      {
        returnDocument: 'after',
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    this.logger.log(`Lead capturado: ${lead.email} (${lead.phoneE164})`);
    return this.toPublicLead(lead);
  }

  async updateStage(
    id: string,
    stage: LeadStage,
    eventId?: string,
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

    if (stage === LeadStage.WhatsappJoined) {
      // No se espera ni se propaga el error: el pixel/CAPI nunca debe romper
      // el flujo real del lead uniéndose al grupo.
      void this.metaConversions.sendEvent({
        eventName: 'WhatsAppJoin',
        eventId: eventId ?? lead._id.toString(),
        email: lead.email,
        phoneE164: lead.phoneE164,
        fbclid: lead.tracking?.fbclid,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      });
    }

    return this.toPublicLead(lead);
  }

  async findAll(page = 1, limit = 25, filters: LeadFilters = {}) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const filter = this.buildFilter(filters);

    const [items, total] = await Promise.all([
      this.leadModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .lean()
        .exec(),
      this.leadModel.countDocuments(filter),
    ]);

    return { items, total, page: safePage, limit: safeLimit };
  }

  /** Trae todos los leads sin paginar, para exportar a CSV/Excel/PDF. */
  async findAllForExport(filters: LeadFilters = {}) {
    return this.leadModel
      .find(this.buildFilter(filters))
      .sort({ createdAt: -1 })
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
    const grouped = await this.leadModel.aggregate<{
      _id: LeadStage;
      count: number;
    }>([{ $group: { _id: '$stage', count: { $sum: 1 } } }]);

    const byStage = Object.values(LeadStage).reduce<Record<string, number>>(
      (acc, stage) => ({ ...acc, [stage]: 0 }),
      {},
    );
    grouped.forEach(({ _id, count }) => {
      byStage[_id] = count;
    });

    const total = Object.values(byStage).reduce((sum, count) => sum + count, 0);
    return { total, byStage };
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
