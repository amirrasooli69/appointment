import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { ClinicService } from "src/modules/clinic/clinic.service";
import { Request } from "express";
import { UnauthorizedMessage } from "src/common/enum/message.enum";
import { isJWT } from "class-validator";
import { JwtService } from "@nestjs/jwt";
import { A_JWT_SECRET_CLINIC } from "src/common/constant/jwt.const";

export class ClinicgGuard implements CanActivate {
    constructor( private authService: AuthService,
                private clinicService: ClinicService,
                private jwtService: JwtService
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);
        // console.log("token =====> "+ token);
        const clinicId = this.verifyClinicAccessToken(token);
        console.log("clinicId =====> "+ clinicId);

        // const clinic = await this.clinicService.findOneById(+clinicId);
        // request.clinic = clinic;
        return true;
    }

    verifyClinicAccessToken(token: string) {
        try {
            console.log("token ======>" + token);
          const verified = this.jwtService.verify(token, {
            secret: A_JWT_SECRET_CLINIC,
          });

          console.log("viryfied ======>" + verified);
          if (verified?.clinicId && !isNaN(parseInt(verified.clinicId)))
            return verified?.clinicId;
          throw new UnauthorizedException("وارد حساب کاربری خود شوید");
        } catch (err) {
            console.log(err.message);
          throw new UnauthorizedException("مجددا وارد حساب کاربری خود شوید");
        }
      }


    extractToken(req: Request): string {
        const {authorization= undefined}= req?.headers ?? {};
        if(!authorization) throw new UnauthorizedException(UnauthorizedMessage.Login)
        const [bearer, token]= authorization.split(" ")
        if(bearer.toLowerCase() !== "bearer") throw new UnauthorizedException(UnauthorizedMessage.Login)
        if(token && !isJWT(token)) throw new UnauthorizedException(UnauthorizedMessage.Login)
        return token;
    }
}