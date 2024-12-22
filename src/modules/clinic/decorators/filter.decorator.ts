import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { ClinicStatus } from "../enum/status.enum";

export const ClinicFilter = () => applyDecorators(
    ApiQuery({name: "search", type: String, required: false}),
    ApiQuery({name: "status", type: String, required: false, enum: ClinicStatus})
)