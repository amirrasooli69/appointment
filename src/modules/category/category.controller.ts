import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FormType } from "src/common/enum/formtype.enum";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";

@Controller("category")
@ApiTags("category")
export class CategoryController {
constructor(private categoryService: CategoryService){}

    @Post("/")
    @ApiCreatedResponse({example: {message: "created"}})
    @ApiOperation({summary: "create category"}) // detail for backend developer

    @ApiConsumes(FormType.Urlencoded, FormType.Json)
    create(@Body() dto: CreateCategoryDto) {
      return this.categoryService.create(dto);
    }

    @Get("/:id")
    findOne(@Param("id", ParseIntPipe) id: number){
        return this.categoryService.findOne(id)
    }

    @Get()
    findAll(){
        return this.categoryService.findAll()
    }

    @Put("/:id")
    @ApiConsumes(FormType.Urlencoded, FormType.Json)
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto){
        return this.categoryService.update(id, dto)
    }

    @Delete("/:id")
    delete(@Param("id", ParseIntPipe) id: number){
        return this.categoryService.delete(id)
    }

}