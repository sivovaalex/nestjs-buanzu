import { Module } from '@nestjs/common';
import { LandingService } from './landing.service';
import { LandingController } from './landing.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Landing } from "./landing.entity";


@Module({
  imports: [
    TypeOrmModule.forFeature([Landing]),
  ],
  providers: [LandingService],
  controllers: [LandingController]
})
export class LandingModule {}