
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsEnum, IsMobilePhone, IsNotEmpty, isNotEmpty, IsNumber, IsPhoneNumber} from "class-validator";
import {LocationType} from "../enum/type.enum";
import { BadRequestMessage } from "src/common/enum/message.enum";

export class CreateClinicDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  categoryId: number;
  @ApiProperty()
  manager_name: string;
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, {message: BadRequestMessage.InCorrectMobileNumber})
  manager_mobile: string;
  @ApiProperty()
  @IsNotEmpty({message: "استان نمیتواند خالی باشد"})
  @IsNumber()
  province: number;
  @ApiProperty()
  @IsNotEmpty({message: "شهر نمیتواند خالی باشد"})
  @IsNumber()
  city: number;
  @ApiProperty()
  address: string;
  @ApiProperty()
  @IsPhoneNumber("IR", {message: BadRequestMessage.InCorrectPhoneNumber})
  tel_1: string;
  @ApiProperty({format: "binary"})
  license: string;
  @ApiProperty({enum: LocationType})
  @IsEnum(LocationType, {message: BadRequestMessage.InCorrectTypeOffice})
  location_type: string;
  @ApiPropertyOptional({format: "binary"})
  rent_agreement: string;
  @ApiProperty({format: "binary"})
  front_image: string;
  @ApiPropertyOptional({format: "binary"})
  side_image: string;
  @ApiProperty({format: "binary"})
  clinic_image_1: string;
  @ApiPropertyOptional({format: "binary"})
  clinic_image_2: string;
}
