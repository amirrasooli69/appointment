import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClinicEntity } from "./entity/clinic.entity";
import { ClinicDocumentEntity } from "./entity/document.entity";
import { ClinicDoctorEntity } from "./entity/doctors.entity";
import { ClinicDetailEntity } from "./entity/detail.entity";
import { ClinicService } from "./clinic.service";
import { ClinicController } from "./clinic.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClinicEntity,
      ClinicDocumentEntity,
      ClinicDoctorEntity,
      ClinicDetailEntity,
    ]),
  ],
  controllers: [ClinicController],
  providers: [ClinicService],
})
export class ClinicModule {}
