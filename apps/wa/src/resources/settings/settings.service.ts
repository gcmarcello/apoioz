import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SettingsService {
  constructor(private readonly configService: ConfigService) {}

  get(key: string): string {
    const value = this.configService.get<string>(key);

    if (!value) {
      throw new Error(key + " environment variable does not set");
    }

    return value;
  }

  getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + " environment variable is not a number");
    }
  }

  getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, "\n");
  }

  get nodeEnv(): string {
    return this.getString("NODE_ENV");
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === "development";
  }

  get isProduction(): boolean {
    return this.nodeEnv === "production";
  }
}
