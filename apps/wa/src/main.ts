import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WhatsappService } from "./resources/whatsapp/whatsapp.service";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { MainGuard } from "./main.guard";

// "dev": "nest start --watch --preserveWatchOutput",

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const swaggerDocument = new DocumentBuilder()
    .setTitle("BNY Whatsapp API")
    .setVersion("1.0")
    .addApiKey({ type: "apiKey" }, "KEY")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerDocument);

  SwaggerModule.setup("docs", app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new MainGuard());

  await app.get(WhatsappService).bootstrap();
  await app.listen(8080, () =>
    console.log(
      `
      📞 Apoioz WhatsApp Server
      - Local:        http://localhost:${8080}
      - Environments: .env
    `
    )
  );
}
bootstrap();
