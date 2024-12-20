import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClinicEntity } from "./entity/clinic.entity";
import { ClinicDocumentEntity } from "./entity/document.entity";
import { ClinicDoctorEntity } from "./entity/doctors.entity";
import { ClinicDetailEntity } from "./entity/detail.entity";
import { ClinicService } from "./clinic.service";
import { ClinicController } from "./clinic.controller";
import { CategoryService } from "../category/category.service";
import { CategoryEntity } from "../category/entity/category.entity";
import { S3Service } from "../s3/s3.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClinicEntity,
      ClinicDocumentEntity,
      ClinicDoctorEntity,
      ClinicDetailEntity,
      CategoryEntity
    ]),
  ],
  controllers: [ClinicController],
  providers: [ClinicService, CategoryService, S3Service],
})
export class ClinicModule {}
