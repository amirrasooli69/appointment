export enum InCorrectFormat {
    Mobile= "شماره موبایل صحیح نمیباشد",
    Name= "تعداد کارکتر وارد شده نام اشتباه است",
    Family= "تعداد کارکتر وارد شده نام خانوادگی اشتباه است",
    Username= "فرمت وارد شده نام کاربری درست نمیباشد",
    Password= "رمز عبور باید بین ۸ تا ۱۶ کارکتر باشد",
    Code= "کد وارد شده ۵ کاراکتر است",
    Token= "توکن وارد شده صحیح نمیباشد"
}

export enum ConfilictMessage {
    mobile= "این شماره موبایل قبلا ثبت شده است"
}

export enum PublicMessage {
    AccountCreated= "حساب کاربری شما با موفقیت ایجاد شد",
    SendLinkForgetPassword= "با لینک زیر میتوانید رمز عبور را عوض کنید",
    InCorrectData= "اطلاعات وارد شده صحیح نمیباشد",
    Updated= "به روز رسانی با موفقیت انجام شد"
}

export enum UnauthorizedMessage {
    IncorrectUserPass = "نام کاربری یا رمز عبور اشتباه است",
    LoginAgain= "دوباره وارد حساب کاربری خود شوید"
}

export enum NotFoundMessage {
    AccountNotFound = "حساب کاربری یافت نشد"
}

export enum OtpMessage {
    SendOtpCode = "رمز یکبار مصرف ارسال شد",
    DontExpiredOtpCode= "کد قبلی هنوز منقضی نشده است",
    ExpiredOtpCode= "کد قبلی منقضی شده است",
    InCorrectOtpCode= "کد اشتباه است",
    InCorrectToken= "توکن ارسال شده صحیح نمیباشد"
}

export enum BadRequestMessage {
    IncorrectRepeatPassword= "رمز عبور با تکرار آن برابر نیست",
    ChangePasswordTime= "هر یک ساعت امکان عوض کرد رمز را دارید",
    ExpiredLink= "لینک مورد نظر منقضی شده"
}