import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClinicEntity } from "./entity/clinic.entity";
import { Repository } from "typeorm";
import { ClinicDetailEntity } from "./entity/detail.entity";
import { ClinicDoctorEntity } from "./entity/doctors.entity";
import { ClinicDocumentEntity } from "./entity/document.entity";
import { CreateClinicDto } from "./dto/clinic.dto";
import { ConfilictMessage, PublicMessage } from "src/common/enum/message.enum";
import { isMobilePhone, isPhoneNumber } from "class-validator";
import { CategoryService } from "../category/category.service";
import { getCityAndProvinceNameByCode } from "src/common/util/city.util";
import slugify from "slugify";

@Injectable()
export class ClinicService {
  constructor(@InjectRepository(ClinicEntity) private clinicRepository: Repository<ClinicEntity>,
  @InjectRepository(ClinicDetailEntity) private detailRepository: Repository<ClinicDetailEntity>,
  @InjectRepository(ClinicDoctorEntity) private doctorRepository: Repository<ClinicDoctorEntity>,
  @InjectRepository(ClinicDocumentEntity) private documentRepository: Repository<ClinicDocumentEntity>,
  private categoryService: CategoryService
) {}
  async register(dto: CreateClinicDto){
    const {manager_name, name, manager_mobile, province, city, address, categoryId, tel_1, license, location_type}= dto;
    await this.checkMobile(manager_mobile);
    await this.checkTelephone(tel_1);
    const category = await this.categoryService.findOne(categoryId)
    const {cityName, provinceName}= getCityAndProvinceNameByCode(province, city)
    const slug = slugify(name)
    let clinic = this.clinicRepository.create({
      name,
      slug,
      manager_mobile,
      manager_name,
      categoryId: category.id,
      location_type
    })

    clinic = await this.clinicRepository.save(clinic)

    let detail = this.detailRepository.create({
      city: cityName,
      province: provinceName,
      address,
      clinicId: clinic.id,

    })
    detail = await this.detailRepository.save(detail);

    clinic.detailId = detail.id;
    await this.clinicRepository.save(clinic);

    return {
      message: PublicMessage.Created + " منتظر تایید حساب خود باشید"
    }
  }

  async checkTelephone(phone: string){
    const existPhone = await this.detailRepository.findOneBy([{tel_1: phone}, {tel_2: phone}])
    if(existPhone && isPhoneNumber(phone, "IR")) throw new ConflictException(ConfilictMessage.telephone)
    return existPhone;
  }

  async checkMobile(mobile: string){
    const existMobile = await this.clinicRepository.findOneBy({manager_mobile: mobile})
    if(existMobile && isMobilePhone(mobile, "fa-IR")) throw new ConflictException(ConfilictMessage.mobile)
    return existMobile;
  }
}
