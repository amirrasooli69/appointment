import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserEntity } from "../user/entity/user.entity";
import { JwtService } from "@nestjs/jwt";
import { ClinicEntity } from "../clinic/entity/clinic.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, ClinicEntity])],
    controllers: [AuthController],
    providers: [AuthService, JwtService],
    exports: [AuthService]
})
export class AuthModule{}