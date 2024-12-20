import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { LocationType } from "../enum/type.enum";
import { CategoryEntity } from "src/modules/category/entity/category.entity";
import { ClinicDoctorEntity } from "./doctors.entity";
import { ClinicDetailEntity } from "./detail.entity";
import { ClinicDocumentEntity } from "./document.entity";
import { ClinicStatus } from "../enum/status.enum";

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
    @Column({type: "enum", enum: ClinicStatus, default: ClinicStatus.Pending})
    status: string;
    @Column({nullable: true, unique: true})
    detailId: number;
    @Column({nullable: true, unique: true})
    documentsId: number;
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
    @OneToOne(()=> ClinicDocumentEntity, doc => doc.clinic)
    @JoinColumn()
    documents: ClinicDocumentEntity
    @CreateDateColumn()
    created_at: Date;
}