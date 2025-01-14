import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { WeekDays } from "../enum/week-day.enum";
import { DoctorStatus } from "../enum/status.enum";

@Entity("doctor_schedule")
export class DoctorScheduleEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column()
    doctorId: number;
    @Column({type: "enum", enum: WeekDays})
    day: string;
    @Column()
    start_time: string;
    @Column()
    end_time: string;
    @Column({type: "enum", enum: DoctorStatus})
    status: string
}