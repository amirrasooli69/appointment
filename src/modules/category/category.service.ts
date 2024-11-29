import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "./entity/category.entity";
import { Repository } from "typeorm";
import { CreateCategoryDto } from "./dto/category.dto";

@Injectable()
export class CategoryService {
constructor(@InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>){}
    async register(dto: CreateCategoryDto) {}
}