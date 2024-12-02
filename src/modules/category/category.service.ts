import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "./entity/category.entity";
import { Repository } from "typeorm";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";
import { NotFoundMessage, PublicMessage } from "src/common/enum/message.enum";

@Injectable()
export class CategoryService {
constructor(@InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>){}
    async create(dto: CreateCategoryDto) {
        const {title, description, slug}= dto;
        await this.categoryRepository.insert({
            title, description, slug
        })

        return {
            message: PublicMessage.Created
        }
    }

    async findAll() {
        return this.categoryRepository.findBy({})
    }

    async findOne(id: number) {
        const category = await this.categoryRepository.findOneBy({id})
        if(!category) throw new NotFoundException(NotFoundMessage.NotFound)
        return category
    }

    async delete(id: number) {
        const category = await this.findOne(id)
        if(!category) throw new NotFoundException(NotFoundMessage.NotFound)
        await this.categoryRepository.remove(category)
        return {
            message: PublicMessage.Deleted
        }
    }

    async update(id: number, dto: UpdateCategoryDto) {
        const {title, description, slug}= dto;
        const category = await this.categoryRepository.findOneBy({id})
        if(!category) throw new NotFoundException(NotFoundMessage.NotFound)
        
        if(title) category.title = title;
        if(description) category.description = description;
        if(slug) category.slug = slug;
 
        await this.categoryRepository.save(category)

        return {
            message: PublicMessage.Updated
        }
    }

}