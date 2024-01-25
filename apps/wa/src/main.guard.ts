import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class MainGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const key = request.headers.key;

    if (!key || key !== process.env.API_SECRET) {
      return false;
    }

    return true;
  }
}
