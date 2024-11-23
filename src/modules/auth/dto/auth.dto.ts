import { ApiProperty } from "@nestjs/swagger";
import { IsJWT, IsMobilePhone, Length, Matches } from "class-validator";
import { InCorrectFormat } from "src/common/enum/message.enum";

export class SignupDto {
  @ApiProperty()
  @Length(3, 50, {message: InCorrectFormat.Name})
  firstname: string;
  @ApiProperty()
  @Length(3, 50, {message: InCorrectFormat.Family})
  lastname: string;
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, {message: InCorrectFormat.Mobile})
  mobile: string;
}
export class LoginDto {
  @ApiProperty()
  @Matches(/[a-z0-9]\_\.\-\{5,50}/gi, {message: InCorrectFormat.Username})
  username: string;
  @ApiProperty()
  @Length(8, 16, {message: InCorrectFormat.Password})
  password: string;
}
export class SendOtpDto {
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, {message: InCorrectFormat.Mobile})
  mobile: string;
}
export class CheckOtpDto {
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, {message: InCorrectFormat.Mobile})
  mobile: string;
  @ApiProperty()
  @Length(5, 5, { message: InCorrectFormat.Code})
  code: string;
}
export class refreshTokenDto {
  @ApiProperty()
  @IsJWT({message: InCorrectFormat.Token})
  refreshToken: string;
}
export class ForgetPasswordDto {
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, {message: InCorrectFormat.Mobile})
  mobile: string;
}
