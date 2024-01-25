import { Global, Module } from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { ConfigModule } from "@nestjs/config";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".development.env"],
    }),
  ],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
