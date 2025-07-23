import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { 
  AuthException,
  NotFoundException,
  InternalServerException,
} from '../common/exceptions/custom.exception';
import { ERROR_CODES } from '../common/constants/error-codes';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          password: true,
        },
      });
      
      if (!user) {
        throw new AuthException(
          ERROR_CODES.AUTH_INVALID_CREDENTIALS,
          undefined,
          'username',
        );
      }

      const isPasswordValid = await bcrypt.compare(pass, user.password);
      if (!isPasswordValid) {
        throw new AuthException(
          ERROR_CODES.AUTH_INVALID_CREDENTIALS,
          undefined,
          'password',
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;

      return userWithoutPassword;
    } catch (error) {
      if (error instanceof AuthException) {
        throw error;
      }
      
      throw new InternalServerException(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        'Error durante la validación del usuario',
      );
    }
  }

  async generateTokens(userId: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        // Ajustar según tu esquema
        select: { role: true },
      });

      if (!user) {
        throw new NotFoundException(
          ERROR_CODES.USER_NOT_FOUND,
          'Usuario no encontrado para generar tokens',
          'userId',
        );
      }

      const jti = uuidv4();

      const payload = { sub: userId, role: user.role, jti };

      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      });

      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '30d',
      });

      // Almacenar el refresh token en la base de datos
      await this.prisma.refreshToken.create({
        data: {
          jti,
          token: refreshToken,
          userId: userId,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        },
      });

      return { accessToken, refreshToken };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerException(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        'Error al generar tokens de autenticación',
      );
    }
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    const tokens = await this.generateTokens(user.id);
    
    return {
      user,
      ...tokens,
    };
  }
}
