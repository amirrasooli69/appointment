import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ChangePasswordDto, CheckOtpDto, ForgetPasswordDto, LoginDto, refreshTokenDto, SendOtpDto, SignupDto } from "./dto/auth.dto";
import { ApiConsumes } from "@nestjs/swagger";
import { FormType } from "src/common/enum/formtype.enum";

@Controller("/auth")
export class AuthController {
    constructor(private authService: AuthService){}
    @Post("signup")
    @ApiConsumes(FormType.Urlencoded, FormType.Json)
    signup(@Body() dto: SignupDto){
        return this.authService.signup(dto)
    }

    @Post("login")
    @ApiConsumes(FormType.Urlencoded, FormType.Json)
    login(@Body() dto: LoginDto){
        return this.authService.login(dto)
    }

    @Post("send-otp")
    @ApiConsumes(FormType.Urlencoded, FormType.Json)
    sendOtp(@Body() dto: SendOtpDto){
        return this.authService.sendOtp(dto)
    }

    @Post("check-otp")
    @ApiConsumes(FormType.Urlencoded, FormType.Json)
    checkOtp(@Body() dto: CheckOtpDto){
        return this.authService.checkOtp(dto);
    }

    @Post("forget-password")
    @ApiConsumes(FormType.Urlencoded, FormType.Json)
    forgetPassword(@Body() dto: ForgetPasswordDto){
        return this.authService.forgetPassword(dto)
    }

    @Post("refreshtoken")
    @ApiConsumes(FormType.Urlencoded, FormType.Json)
    refreshToken(@Body() dto: refreshTokenDto){
        return this.authService.refreshToken(dto)
    }

    @Post("changeme")
    @ApiConsumes(FormType.Mulipart, FormType.Json)
    changePassword(@Body() changePasswordDto: ChangePasswordDto){
        return this.authService.changePassword(changePasswordDto)
    }

    @Post("/clinic/send-otp")
    @ApiConsumes(FormType.Urlencoded, FormType.Json)
    clinicLogin(@Body() dto: SendOtpDto){
        return this.authService.clinicLoginOtp(dto);
    }

    @Post("/clinic/check-otp")
    @ApiConsumes(FormType.Urlencoded, FormType.Json)
    clinicCheckOtp(@Body() dto: CheckOtpDto){
        return this.authService.clinicCheckOtp(dto)
    }
}