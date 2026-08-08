import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { MetaConversionsService } from './meta-conversions.service';
import { Lead, LeadSchema } from './schemas/lead.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lead.name, schema: LeadSchema }]),
  ],
  controllers: [LeadsController],
  providers: [LeadsService, MetaConversionsService],
  exports: [LeadsService],
})
export class LeadsModule {}
