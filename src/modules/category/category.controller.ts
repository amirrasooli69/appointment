import { Body, Controller, Post } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FormType } from "src/common/enum/formtype.enum";
import { CreateCategoryDto } from "./dto/category.dto";

@Controller("category")
@ApiTags("category")
export class CategoryController {
constructor(private categoryService: CategoryService){}

    @Post("register")
    @ApiConsumes(FormType.Mulipart)
    register(@Body() dto: CreateCategoryDto){
        return this.categoryService.register(dto)
    }

}