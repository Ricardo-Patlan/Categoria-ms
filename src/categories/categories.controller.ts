import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @MessagePattern({ cmd: 'create_category' })
  create(@Payload() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @MessagePattern({ cmd: 'find_all_categories' })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.categoriesService.findAll(paginationDto);
  }

  @MessagePattern({ cmd: 'find_one_category' })
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_category' })
  update(@Payload() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(
      updateCategoryDto.id,
      updateCategoryDto,
    );
  }

  @MessagePattern({ cmd: 'remove_category' })
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
