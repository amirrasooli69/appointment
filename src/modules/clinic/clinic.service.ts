import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClinicEntity } from "./entity/clinic.entity";
import { FindOptionsWhere, ILike, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { ClinicDetailEntity } from "./entity/detail.entity";
import { ClinicDoctorEntity } from "./entity/doctors.entity";
import { ClinicDocumentEntity } from "./entity/document.entity";
import { CreateClinicDto } from "./dto/clinic.dto";
import { ConfilictMessage, PublicMessage } from "src/common/enum/message.enum";
import { isDate, isEnum, isMobilePhone, isPhoneNumber } from "class-validator";
import { CategoryService } from "../category/category.service";
import { getCityAndProvinceNameByCode } from "src/common/util/city.util";
import slugify from "slugify";
import { S3Service } from "../s3/s3.service";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { paginationSolver } from "src/common/util/pagination.util";
import { ClinicStatus } from "./enum/status.enum";
import { ClinicFilterDto } from "./dto/filter.dto";

@Injectable()
export class ClinicService {
  constructor(
    @InjectRepository(ClinicEntity)
    private clinicRepository: Repository<ClinicEntity>,
    @InjectRepository(ClinicDetailEntity)
    private detailRepository: Repository<ClinicDetailEntity>,
    @InjectRepository(ClinicDoctorEntity)
    private doctorRepository: Repository<ClinicDoctorEntity>,
    @InjectRepository(ClinicDocumentEntity)
    private documentRepository: Repository<ClinicDocumentEntity>,
    private categoryService: CategoryService,
    private s3Service: S3Service
  ) {}

  async register(dto: CreateClinicDto, files: Express.Multer.File[]) {
    const {
      manager_name,
      name,
      manager_mobile,
      tel_1,
      location_type,
      province,
      city,
      address,
      categoryId,
    } = dto;
    await this.checkMobile(manager_mobile);
    await this.checkTelephone(tel_1);
    const category = await this.categoryService.findOne(categoryId);
    const { provinceName, cityName } = getCityAndProvinceNameByCode(
      province,
      city
    );
    const slug = slugify(name);
    console.log(slug);

    await this.checkSlug(slug);
    let filesObject: { [key: string]: { Location: string; Key: string } } = {};
    for (const file of files) {
      filesObject[file.fieldname] = await this.s3Service.uploadFile(
        file,
        "clinic"
      );
      console.log(filesObject[file.fieldname]);
    }
    let clinic = this.clinicRepository.create({
      name,
      slug,
      manager_mobile,
      manager_name,
      categoryId: category.id,
      location_type,
    });
    clinic = await this.clinicRepository.save(clinic);
    let detail = this.detailRepository.create({
      tel_1,
      city: cityName,
      province: provinceName,
      address,
      clinicId: clinic.id,
    });
    detail = await this.detailRepository.save(detail);
    clinic.detailId = detail.id;
    let document = this.documentRepository.create({
      clinic_image_1: filesObject?.["clinic_image_1"]?.Location,
      clinic_image_2: filesObject?.["clinic_image_2"]?.Location,
      license: filesObject?.["license"]?.Location,
      rent_agreement: filesObject?.["rent_agreement"]?.Location,
      side_image: filesObject?.["side_image"]?.Location,
      front_image: filesObject?.["front_image"]?.Location,
      clinicId: clinic.id,
    });
    document = await this.documentRepository.save(document);
    clinic.documentsId = document.id;
    clinic = await this.clinicRepository.save(clinic);
    return {
      message: "ثبت نام شما با موفقیت انجام شد منتظر تایید حساب خود باشید",
    };
  }

  async checkTelephone(phone: string) {
    const existPhone = await this.detailRepository.findOneBy([
      { tel_1: phone },
      { tel_2: phone },
    ]);
    if (existPhone && isPhoneNumber(phone, "IR"))
      throw new ConflictException(ConfilictMessage.telephone);
    return existPhone;
  }

  async checkSlug(slug: string) {
    const existSlug = await this.clinicRepository.findOneBy({ slug });
    if (existSlug) throw new ConflictException("نام وارد شده تکراری است");
    return existSlug;
  }

  async checkMobile(mobile: string) {
    const existMobile = await this.clinicRepository.findOneBy({
      manager_mobile: mobile,
    });
    if (existMobile && isMobilePhone(mobile, "fa-IR"))
      throw new ConflictException(ConfilictMessage.mobile);
    return existMobile;
  }

  async find(paginationDto: PaginationDto, filterDto: ClinicFilterDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const { search, status, from_date, to_date } = filterDto;
    let where: FindOptionsWhere<ClinicEntity> = {};
    if(status && isEnum(status, ClinicStatus)){
      where['status'] = status;
    }
    if(search && search?.length > 2) {
      where["name"]= ILike(`%${search}%`)
    }
    
    if(to_date && from_date && isDate(new Date(to_date) && isDate(new Date(from_date)))){
      let to =new Date( new Date(to_date).setUTCHours(0, 0, 0));
      let from =new Date( new Date(from_date).setUTCHours(0, 0, 0));

      where["created_at"] =(MoreThanOrEqual(from) ,LessThanOrEqual(to));
    } else if(from_date && isDate(new Date(from_date))){
      let from =new Date( new Date(from_date).setUTCHours(0, 0, 0));
      where["created_at"] = MoreThanOrEqual(from);
    } else if(to_date && isDate(new Date(to_date))){
      let to =new Date( new Date(to_date).setUTCHours(0, 0, 0));
      where["created_at"] = LessThanOrEqual(to);
    }


    const clinics = await this.clinicRepository.find({
      where,
      skip,
      take: limit,
      order: { created_at: "DESC" },
    });
  }
}
