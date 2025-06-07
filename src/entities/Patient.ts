import { Entity, Column, OneToMany, ChildEntity } from 'typeorm';
import { User } from './User';
import { Appointment } from './Appointment';

@ChildEntity()
export class Patient extends User {
    @Column()
    birth_date!: Date;

    @Column({ nullable: true })
    health_insurance!: string;

    @OneToMany(() => Appointment, (appointment: Appointment) => appointment.patient)
    appointments!: Appointment[];

    constructor() {
        super();
        this.role = 'patient';
    }
} 