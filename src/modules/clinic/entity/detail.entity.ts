import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { ClinicEntity } from "./clinic.entity";

@Entity("clinic_detail")
export class ClinicDetailEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column({unique: true})
  clinicId: number;
  @Column({default: 1})
  province: string;
  @Column({default: 1})
  city: string;
  @Column()
  address: string;
  @Column({default: 12345678912})
  tel_1: string;
  @Column({nullable: true})
  tel_2: string;
  @Column({nullable: true})
  instagram: string;
  @Column({nullable: true})
  telegram: string;
  @OneToOne(()=> ClinicEntity, clinic => clinic.detail, {onDelete: "CASCADE"})
  clinic: ClinicEntity;
}