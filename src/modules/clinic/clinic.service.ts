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
import { S3Service } from "../s3/s3.service";

@Injectable()
export class ClinicService {
  constructor(@InjectRepository(ClinicEntity) private clinicRepository: Repository<ClinicEntity>,
  @InjectRepository(ClinicDetailEntity) private detailRepository: Repository<ClinicDetailEntity>,
  @InjectRepository(ClinicDoctorEntity) private doctorRepository: Repository<ClinicDoctorEntity>,
  @InjectRepository(ClinicDocumentEntity) private documentRepository: Repository<ClinicDocumentEntity>,
  private categoryService: CategoryService,
  private s3Service: S3Service
) {}
  async register(dto: CreateClinicDto, files: Express.Multer.File[]){
    const {manager_name, name, manager_mobile, province, city, address, categoryId, tel_1, license, location_type}= dto;
    await this.checkMobile(manager_mobile);
    await this.checkTelephone(tel_1);
    const category = await this.categoryService.findOne(categoryId)
    const {cityName, provinceName}= getCityAndProvinceNameByCode(province, city)
    const slug = slugify(name)
    await this.checkSlug(slug)
    let filesObject: {[key: string]: {Location: string, Key: string}} = {}
    for (const file of files) {
      filesObject[file.fieldname] = await this.s3Service.uploadFile(
        file,
        "clinic"
      );
    }
    let clinic = this.clinicRepository.create({
      name,
      slug,
      manager_mobile,
      manager_name,
      categoryId: category.id,
      location_type
    })

    let documet = this.documentRepository.create({
      clinic_image_1: filesObject?.["clinic_image_1"]?.Location,
      clinic_image_2: filesObject?.["clinic_image_2"]?.Location,
      license: filesObject?.["license"]?.Location,
      rent_agreement: filesObject?.["rent_agreement"]?.Location,
      side_image: filesObject?.["side_image"]?.Location,
      front_image: filesObject?.["front_image"]?.Location,
      clinicId: clinic.id
    })
    documet = await this.documentRepository.save(documet)
    clinic.documentsId = documet.id
    let detail = this.detailRepository.create({
      city: cityName,
      province: provinceName,
      address,
      clinicId: clinic.id,
    })
    
    detail = await this.detailRepository.save(detail);
    clinic.detailId = detail.id;
    await this.clinicRepository.save(clinic);
    clinic = await this.clinicRepository.save(clinic)

    return {
      message: PublicMessage.Created + " منتظر تایید حساب خود باشید"
    }
  }

  async checkTelephone(phone: string){
    const existPhone = await this.detailRepository.findOneBy([{tel_1: phone}, {tel_2: phone}])
    if(existPhone && isPhoneNumber(phone, "IR")) throw new ConflictException(ConfilictMessage.telephone)
    return existPhone;
  }

  async checkSlug(slug: string){
    const existSlug = await this.clinicRepository.findOneBy({slug});
    if(existSlug) throw new ConflictException("نام وارد شده تکراری است")
    return existSlug
    
  }

  async checkMobile(mobile: string){
    const existMobile = await this.clinicRepository.findOneBy({manager_mobile: mobile})
    if(existMobile && isMobilePhone(mobile, "fa-IR")) throw new ConflictException(ConfilictMessage.mobile)
    return existMobile;
  }
}
