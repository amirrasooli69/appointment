import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  const config = new DocumentBuilder()
  .setTitle("Appointment System")
  .setDescription("manageiment appointment")
  .setVersion("v0.1.0")
  .addBearerAuth({
    type: "http",
    bearerFormat: "JWT",
    in: "header",
    scheme: "bearer"
  }, "Authorization")
  .build()
  const swaggerDocument = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/swagger", app, swaggerDocument);
  await app.listen(process.env.PORT ?? 3000, ()=> {
    console.log("run project: http://localhost:3000");
  });
}
bootstrap();
