import { Body, Controller, Post } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ClinicService } from "./clinic.service";
import { CreateClinicDto } from "./dto/clinic.dto";
import { FormType } from "src/common/enum/formtype.enum";

@Controller("clinic")
@ApiTags("clinic")
export class ClinicController {
    constructor(private clinicService: ClinicService){}

    @Post("register")
    @ApiConsumes(FormType.Mulipart)
    register(@Body() dto: CreateClinicDto){
        return this.clinicService.register(dto)
    }
}