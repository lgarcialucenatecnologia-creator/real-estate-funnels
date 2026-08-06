import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { CreateLeadDto } from './dto/create-lead.dto';
import { Lead, LeadDocument, LeadStage } from './schemas/lead.schema';

export interface LeadRequestContext {
  ipAddress?: string;
  userAgent?: string;
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

  async updateStage(id: string, stage: LeadStage): Promise<PublicLead> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Lead no encontrado');
    }

    const timestamps: Partial<Record<keyof Lead, Date>> = {};
    if (stage === LeadStage.WhatsappJoined) timestamps.whatsappJoinedAt = new Date();
    if (stage === LeadStage.Registered) timestamps.registeredAt = new Date();

    const lead = await this.leadModel.findByIdAndUpdate(
      id,
      { $set: { stage, ...timestamps } },
      { returnDocument: 'after' },
    );

    if (!lead) throw new NotFoundException('Lead no encontrado');
    return this.toPublicLead(lead);
  }

  async findAll(page = 1, limit = 25) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);

    const [items, total] = await Promise.all([
      this.leadModel
        .find()
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .lean()
        .exec(),
      this.leadModel.countDocuments(),
    ]);

    return { items, total, page: safePage, limit: safeLimit };
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
