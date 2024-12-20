import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ClinicService } from "./clinic.service";
import { CreateClinicDto } from "./dto/clinic.dto";
import { FormType } from "src/common/enum/formtype.enum";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";

@Controller("clinic")
@ApiTags("clinic")
export class ClinicController {
    constructor(private clinicService: ClinicService){}

    @Post("register")
    @ApiConsumes(FormType.Mulipart)
    @UseInterceptors(AnyFilesInterceptor({storage: memoryStorage()}))
    register(@Body() dto: CreateClinicDto, @UploadedFiles() files: any){
        return this.clinicService.register(dto, files)
    }

    @Get("/")
    async getAll(){
        return this.clinicService.find()
    }
}