import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";
import { ClinicService } from "src/modules/clinic/clinic.service";
import { Request } from "express";
import { UnauthorizedMessage } from "src/common/enum/message.enum";

export class ClingGuard implements CanActivate {
    constructor( private authService: AuthService,
                private clinicService: ClinicService
    ){}
    canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest()
        const token = this.extractToken(request)
    }

    extractToken(req: Request): string {
        const {authorization= undefined}= req?.headers ?? {};
        if(!authorization) throw new UnauthorizedException(UnauthorizedMessage.Login)
        const [bearer, token]= authorization.split(" ")
        if(bearer.toLowerCase() !== "bearer") throw new UnauthorizedException(UnauthorizedMessage.Login)
    }
}