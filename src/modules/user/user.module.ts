import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports:[TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers:[UserService,],
    exports: [UserService, TypeOrmModule]
})

export class UserModule{}