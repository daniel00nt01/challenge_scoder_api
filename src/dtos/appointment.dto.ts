import { IsString, IsUUID, IsDateString, IsOptional, IsEnum } from 'class-validator';

export class CreateAppointmentDto {
    @IsUUID()
    doctorId: string;

    @IsUUID()
    patientId: string;

    @IsDateString()
    appointment_date: string;

    @IsString()
    @IsOptional()
    notes?: string;
}

export class UpdateAppointmentDto {
    @IsDateString()
    @IsOptional()
    appointment_date?: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsEnum(['scheduled', 'completed', 'cancelled'])
    @IsOptional()
    status?: 'scheduled' | 'completed' | 'cancelled';
} 