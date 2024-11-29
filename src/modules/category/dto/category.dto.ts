import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";

export class CreateCategoryDto {
    @ApiProperty()
    title: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    slug: string;
    @ApiPropertyOptional({nullable: true, format: "binary"})
    image: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}