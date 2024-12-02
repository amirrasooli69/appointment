import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { LocationType } from "../enum/type.enum";
import { CategoryEntity } from "src/modules/category/entity/category.entity";
import { ClinicDoctorEntity } from "./doctors.entity";
import { ClinicDetailEntity } from "./detail.entity";

@Entity("clinic")
export class ClinicEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column({nullable: true})
    categoryId: number;
    @Column()
    name: string;
    @Column({unique: true})
    slug: string;
    @Column({nullable: true, unique: true})
    detailId: number;
    @Column()
    manager_name: string;
    @Column()
    manager_mobile: string;
    @Column({type: "enum", enum: LocationType})
    location_type: string;
    @ManyToOne(()=> CategoryEntity, category => category.clinics, {onDelete: "SET NULL"})
    category: CategoryEntity;
    @ManyToOne(()=> ClinicDoctorEntity, doctor => doctor.clinic)
    doctors: ClinicDoctorEntity[]
    @OneToOne(()=> ClinicDetailEntity, detail=> detail.clinic)
    @JoinColumn()
    detail: ClinicDetailEntity;
}