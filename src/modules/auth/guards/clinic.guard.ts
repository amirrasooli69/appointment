import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";
import { ClinicService } from "src/modules/clinic/clinic.service";
import { Request } from "express";
import { UnauthorizedMessage } from "src/common/enum/message.enum";
import { isJWT } from "class-validator";

export class ClinicgGuard implements CanActivate {
    constructor( private authService: AuthService,
                private clinicService: ClinicService
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest()
        const token = this.extractToken(request)
        const clinicId = this.authService.verifyClinicAccessToken(token);
        await this.clinicService.findOneById(clinicId)
        return true;
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