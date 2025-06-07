import { Entity, Column, OneToMany, ChildEntity } from 'typeorm';
import { User } from './User';
import { Appointment } from './Appointment';

@ChildEntity()
export class Doctor extends User {
    @Column()
    crm!: string;

    @Column()
    specialization!: string;

    @OneToMany(() => Appointment, (appointment: Appointment) => appointment.doctor)
    appointments!: Appointment[];

    constructor() {
        super();
        this.role = 'doctor';
    }
} 