import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ClinicService } from "./clinic.service";
import { CreateClinicDto } from "./dto/clinic.dto";
import { FormType } from "src/common/enum/formtype.enum";
import { AnyFilesInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ClinicFilter } from "./decorators/filter.decorator";
import { ClinicFilterDto } from "./dto/filter.dto";
import { RejectDto } from "./dto/reject.dto";
import { ClinicAuth } from "./decorators/clinic.decoretor";
import { CreateDoctorDto } from "./dto/doctor.dto";
import { ScheduleDto } from "./dto/schedule.dto";

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
    @ClinicFilter()
    async getAll(@Query() paginationDto: PaginationDto, @Query() filterDto: ClinicFilterDto){
        return this.clinicService.find(paginationDto, filterDto)
    }

    @Put("/accept/:id")
    accept(@Param("id", ParseIntPipe) id: number){
        return this.clinicService.accept(id);
    }

    @Put("/reject/:id")
    @ApiConsumes(FormType.Json, FormType.Urlencoded)
    reject(@Param("id", ParseIntPipe) id: number, @Query(){reason}: RejectDto){
        return this.clinicService.reject(id, reason)
    }

    @Post("/create-doctor")
    @ApiConsumes(FormType.Mulipart)
    @ClinicAuth()
    @UseInterceptors(FileInterceptor("image", {storage: memoryStorage(),}))
    createDoctor(@Body() doctorDto: CreateDoctorDto, @UploadedFile() image: Express.Multer.File){
        return this.clinicService.createDoctor(doctorDto, image)
    }

    @Post("/create-doctor-schedule")
    @ApiConsumes(FormType.Json, FormType.Urlencoded)
    @ClinicAuth()
    addSchedule(@Body() scheduleDto: ScheduleDto){
        return this.clinicService.addSchedule(scheduleDto)
    }

    @Get("/doctor-schedule/:doctorId")
    @ApiConsumes(FormType.Json, FormType.Urlencoded)
    @ClinicAuth()
    getSchedule(@Param("doctorId", ParseIntPipe) doctorId: number){
        return this.clinicService.getSchedule(doctorId)
    }
    
}