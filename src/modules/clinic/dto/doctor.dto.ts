import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Matches } from "class-validator";

export class CreateDoctorDto {
    @ApiProperty()
    firstname: string;
    @ApiProperty()
    lastname: string;
    @ApiProperty()
    @Matches(/^[0-9]{4,7}$/, {message: "فرمت وارد شده کد نظام پزشکی اشتباه است"})
    medical_code: string;
    @ApiProperty()
    degree: string;
    @ApiProperty()
    majors: string;
    @ApiPropertyOptional({format: "binary"})
    image?: string;
    @ApiProperty()
    experience: string;
    @ApiProperty()
    clinicId: number;
  }
