import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClinicEntity } from "./entity/clinic.entity";
import { Repository } from "typeorm";
import { ClinicDetailEntity } from "./entity/detail.entity";
import { ClinicDoctorEntity } from "./entity/doctors.entity";
import { ClinicDocumentEntity } from "./entity/document.entity";
import { CreateClinicDto } from "./dto/clinic.dto";

@Injectable()
export class ClinicService {
  constructor(@InjectRepository(ClinicEntity) private clinicRepository: Repository<ClinicEntity>,
  @InjectRepository(ClinicDetailEntity) private detailRepository: Repository<ClinicDetailEntity>,
  @InjectRepository(ClinicDoctorEntity) private doctorRepository: Repository<ClinicDoctorEntity>,
  @InjectRepository(ClinicDocumentEntity) private documentRepository: Repository<ClinicDocumentEntity>,
  
) {}
  async register(dto: CreateClinicDto){
  }
}
