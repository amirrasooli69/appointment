import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entity/user.entity";
import { Repository } from "typeorm";
import {
  CheckOtpDto,
  ForgetPasswordDto,
  LoginDto,
  refreshTokenDto,
  SendOtpDto,
  SignupDto,
} from "./dto/auth.dto";
import { mobileValidation } from "src/common/util/mobile.util";
import { ConfilictMessage, PublicMessage, UnauthorizedMessage } from "src/common/enum/message.enum";
import { randomPassword } from "src/common/util/password.util";
import { isMobilePhone } from "class-validator";
import { compareSync } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { A_JWT_SECRET, R_JWT_SECRET } from "src/common/constant/jwt.const";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}

  async signup(signupDto: SignupDto) {
    const { firstname, lastname, mobile } = signupDto;
    const { phoneNumber } = mobileValidation(mobile);
    let user = await this.userRepository.findOneBy({ mobile: phoneNumber });
    if (user) throw new ConflictException(ConfilictMessage.mobile);
    let {password, hashed} = randomPassword(8)
    await this.userRepository.insert({
      firstname,
      lastname,
      mobile,
      password: hashed
    });

    console.log(password);
    return {
        message: PublicMessage.AccountCreated,
        password
    }
  }
  async login(loginDto: LoginDto) {
    const {password, username} = loginDto;
    let user = await this.userRepository.findOneBy({username});
    if(!user && isMobilePhone(username, "fa-IR")) {
        user = await this.userRepository.findOneBy({mobile: username})
    }
    if(!user) throw new UnauthorizedException(UnauthorizedMessage.IncorrectUserPass)
    if(compareSync(password, user.password)){
        return this.tokenGenerator(user.id)
    }
    throw new UnauthorizedException(UnauthorizedMessage.IncorrectUserPass)
  }
  async sendOtp(sendOtpDto: SendOtpDto) {}
  async checkOtp(checkOtpDto: CheckOtpDto) {}
  async refreshToken(refreshTokenDto: refreshTokenDto) {}
  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {}
  async tokenGenerator(userId: number){
    const accessToken = this.jwtService.sign({userId},{secret: A_JWT_SECRET, expiresIn: "1d"})
    const refreshToken = this.jwtService.sign({userId},{secret: R_JWT_SECRET, expiresIn: "30d"})

    return {
        accessToken, refreshToken
    }
  }
}
