import { Body, Controller, Get, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ClinicService } from "./clinic.service";
import { CreateClinicDto } from "./dto/clinic.dto";
import { FormType } from "src/common/enum/formtype.enum";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";

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
    @Pagination()
    async getAll(@Query() paginationDto: PaginationDto, @Query() filterDto: PaginationDto){
        return this.clinicService.find()
    }
}