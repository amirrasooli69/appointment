import { ClinicEntity } from "src/modules/clinic/entity/clinic.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("category")
export class CategoryEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column()
    title: string;
    @Column()
    description: string;
    @Column()
    slug: string;
    @Column({nullable: true})
    image: string;
    @OneToMany(()=> ClinicEntity, clinic => clinic.category)
    clinics: ClinicEntity[]
}