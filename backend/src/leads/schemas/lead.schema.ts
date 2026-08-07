import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum LeadStage {
  Captured = 'captured',
  ProgressViewed = 'progress_viewed',
  WhatsappJoined = 'whatsapp_joined',
  Registered = 'registered',
}

export type LeadDocument = HydratedDocument<Lead>;

@Schema({ timestamps: true, collection: 'leads' })
export class Lead {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, trim: true, lowercase: true, index: true })
  email: string;

  /** Código ISO del país seleccionado, por ejemplo CO, US, VE. */
  @Prop({ required: true, uppercase: true })
  countryCode: string;

  /** Prefijo telefónico internacional incluyendo el signo, por ejemplo +57. */
  @Prop({ required: true })
  dialCode: string;

  /** Número nacional sin prefijo ni separadores. */
  @Prop({ required: true })
  phoneNumber: string;

  /** Número completo normalizado en formato E.164, por ejemplo +573001112233. */
  @Prop({ required: true, index: true })
  phoneE164: string;

  @Prop({
    type: String,
    enum: Object.values(LeadStage),
    default: LeadStage.Captured,
    index: true,
  })
  stage: LeadStage;

  @Prop({ type: Object, default: {} })
  tracking: Record<string, string>;

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;

  @Prop()
  whatsappJoinedAt?: Date;

  @Prop()
  registeredAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);

LeadSchema.index({ email: 1, phoneE164: 1 }, { unique: true });
LeadSchema.index({ createdAt: -1 });
