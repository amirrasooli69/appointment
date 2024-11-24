import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
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
import {
  ConfilictMessage,
  NotFoundMessage,
  OtpMessage,
  PublicMessage,
  UnauthorizedMessage,
} from "src/common/enum/message.enum";
import { randomPassword } from "src/common/util/password.util";
import { isMobilePhone } from "class-validator";
import { compareSync } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { A_JWT_SECRET, ForgetPassword_JWT_SECRET, R_JWT_SECRET } from "src/common/constant/jwt.const";
import { randomInt } from "crypto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}

  async signup(signupDto: SignupDto) {
    const { firstname, lastname, mobile } = signupDto;
    const { phoneNumber } = mobileValidation(mobile);
    let user = await this.userRepository.findOneBy({ mobile: phoneNumber });
    if (user) throw new ConflictException(ConfilictMessage.mobile);
    let { password, hashed } = randomPassword(8);
    await this.userRepository.insert({
      firstname,
      lastname,
      mobile: phoneNumber,
      password: hashed,
    });
    return {
      message: PublicMessage.AccountCreated,
      password,
    };
  }

  async login(loginDto: LoginDto) {
    const { password, username } = loginDto;
    let user = await this.userRepository.findOneBy({ username });
    if (!user && isMobilePhone(username, "fa-IR")) {
      user = await this.userRepository.findOneBy({ mobile: username });
    }
    if (!user)
      throw new UnauthorizedException(UnauthorizedMessage.IncorrectUserPass);
    if (compareSync(password, user.password)) {
      return this.tokenGenerator(user.id);
    }
    throw new UnauthorizedException(UnauthorizedMessage.IncorrectUserPass);
  }

  async sendOtp(sendOtpDto: SendOtpDto) {
    const { mobile } = sendOtpDto;
    const { phoneNumber } = mobileValidation(mobile);
    let user = await this.userRepository.findOneBy({ mobile: phoneNumber });
    if (!user) throw new NotFoundException(NotFoundMessage.AccountNotFound);
    if (user.otp_expires_in >= new Date())
      throw new ConflictException(OtpMessage.DontExpiredOtpCode);
    const otpCode = randomInt(10000, 99999);
    user.otp_code = String(otpCode);
    user.otp_expires_in = new Date(new Date().getTime() + 1000 * 60);
    await this.userRepository.save(user);

    return {
      message: OtpMessage.SendOtpCode,
      code: otpCode,
    };
  }
  async checkOtp(checkOtpDto: CheckOtpDto) {
    const { code, mobile } = checkOtpDto;
    const { phoneNumber } = mobileValidation(mobile);
    let user = await this.userRepository.findOneBy({ mobile: phoneNumber });
    if (!user) throw new NotFoundException(NotFoundMessage.AccountNotFound);
    if (user.otp_expires_in < new Date())
      throw new UnauthorizedException(OtpMessage.ExpiredOtpCode);

    if (code === user.otp_code) {
      return this.tokenGenerator(user.id);
    }
    throw new UnauthorizedException(OtpMessage.InCorrectOtpCode);
  }

  async refreshToken(refreshTokenDto: refreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    const userId = this.verifyRefreshToken(refreshToken);
    console.log(userId);
    if (userId) return this.tokenGenerator(+userId);
    throw new UnauthorizedException(UnauthorizedMessage.LoginAgain);
  }
  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const { mobile } = forgetPasswordDto;
    let user = await this.userRepository.findOneBy({ mobile });
    if (!user) user = await this.userRepository.findOneBy({ username: mobile });
    if (!user) throw new UnauthorizedException(UnauthorizedMessage.IncorrectUserPass);
    const link = this.forgetPasswordLinkGenerator(user);
    return {
        message: PublicMessage.SendLinkForgetPassword,
        link
    }
  }
  forgetPasswordLinkGenerator(user: UserEntity) {
    const token = this.jwtService.sign(
        {userId: user.id, mobile: user.mobile},
        {secret: ForgetPassword_JWT_SECRET, expiresIn: 1000 * 60}
    );
    const link = `http://localhost:3000/auth/changeme?token=${token}`;
    return link;
  }
  async tokenGenerator(userId: number) {
    const accessToken = this.jwtService.sign(
      { userId },
      { secret: A_JWT_SECRET, expiresIn: "1d" }
    );
    const refreshToken = this.jwtService.sign(
      { userId },
      { secret: R_JWT_SECRET, expiresIn: "30d" }
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  verifyRefreshToken(refreshToken: string) {
    try {
      const verifyed = this.jwtService.verify(refreshToken, {
        secret: R_JWT_SECRET,
      });
      if (verifyed?.userId && !isNaN(parseInt(verifyed?.userId))) {
        return verifyed?.userId;
      }

      throw new UnauthorizedException(UnauthorizedMessage.LoginAgain);
    } catch (error) {
      throw new UnauthorizedException(UnauthorizedMessage.LoginAgain);
    }
  }
}
