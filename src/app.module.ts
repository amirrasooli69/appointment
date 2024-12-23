import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ClinicModule } from "./modules/clinic/clinic.module";
import { CategoryModule } from "./modules/category/category.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      database: "appointment",
      username: "root",
      // password: "",
      password: "aammiirr", 
      synchronize: true,
      entities: ["dist/**/**/**/*.entity{.ts,.js}"]
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    ClinicModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
