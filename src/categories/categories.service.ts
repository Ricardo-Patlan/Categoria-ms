import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private async checkNameIsFree(name: string, exceptId?: number) {
    const existing = await this.prisma.category.findUnique({ where: { name } });
    if (existing && existing.id !== exceptId) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message: `Category with name "${name}" already exists`,
      });
    }
  }

  async create(createCategoryDto: CreateCategoryDto) {
    await this.checkNameIsFree(createCategoryDto.name);
    return this.prisma.category.create({ data: createCategoryDto });
  }

  async findAll(paginationDto: PaginationDto) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const total = await this.prisma.category.count();

    return {
      data: await this.prisma.category.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Category with id #${id} not found`,
      });
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { id: _, ...data } = updateCategoryDto;
    await this.findOne(id);
    if (data.name) await this.checkNameIsFree(data.name, id);
    return this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.category.delete({ where: { id } });
  }
}
