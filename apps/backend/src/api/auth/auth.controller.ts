import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './auth.dto';
import { Public } from './decorator/public.decorator';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { pickUserMe } from './utils';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Req() req: Express.Request) {
    return req.user;
  }

  @Public()
  @Post('signup')
  async signup(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Express.Request
  ) {
    const user = pickUserMe(await this.authService.signup(body.email, body.password));
    // set cookie, passport login
    await new Promise<void>((resolve, reject) => {
      req.login(user, (err) => (err ? reject(err) : resolve()));
    });
    return user;
  }

}
