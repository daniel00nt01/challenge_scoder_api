import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Doctor } from './Doctor';
import { Patient } from './Patient';

@Entity('appointments')
export class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'doctor_id' })
    doctorId!: string;

    @Column({ name: 'patient_id' })
    patientId!: string;

    @ManyToOne(() => Doctor, (doctor: Doctor) => doctor.appointments)
    @JoinColumn({ name: 'doctor_id' })
    doctor!: Doctor;

    @ManyToOne(() => Patient, (patient: Patient) => patient.appointments)
    @JoinColumn({ name: 'patient_id' })
    patient!: Patient;

    @Column()
    appointment_date!: Date;

    @Column({ type: 'text', nullable: true })
    notes!: string;

    @Column({
        type: 'enum',
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    })
    status!: 'scheduled' | 'completed' | 'cancelled';

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
} 