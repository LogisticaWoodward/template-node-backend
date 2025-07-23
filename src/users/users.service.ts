import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { 
  ConflictException,
  NotFoundException,
  InternalServerException,
} from '../common/exceptions/custom.exception';
import { ERROR_CODES } from '../common/constants/error-codes';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          ERROR_CODES.USER_ALREADY_EXISTS,
          'El usuario ya existe',
        );
      }
      
      throw new InternalServerException(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        'Error al crear el usuario',
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new InternalServerException(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        'Error al obtener los usuarios',
      );
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new NotFoundException(
          ERROR_CODES.USER_NOT_FOUND,
          'Usuario no encontrado',
        );
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerException(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        'Error al buscar el usuario',
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      // Crear una copia del DTO para evitar mutaciones
      const updateData: any = { ...updateUserDto };
      
      // Si se está actualizando la contraseña, encriptarla
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      const user = await this.prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          ERROR_CODES.USER_NOT_FOUND,
          'Usuario no encontrado',
        );
      }
      
      if (error.code === 'P2002') {
        throw new ConflictException(
          ERROR_CODES.USER_ALREADY_EXISTS,
          'Los datos del usuario ya existen',
        );
      }
      
      throw new InternalServerException(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        'Error al actualizar el usuario',
      );
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      
      return { message: 'Usuario eliminado correctamente' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          ERROR_CODES.USER_NOT_FOUND,
          'Usuario no encontrado',
        );
      }
      
      throw new InternalServerException(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        'Error al eliminar el usuario',
      );
    }
  }
}
