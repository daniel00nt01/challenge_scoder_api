import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}

export class RegisterDoctorDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    phone: string;

    @IsString()
    crm: string;

    @IsString()
    specialization: string;
}

export class RegisterPatientDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    phone: string;

    @IsString()
    birth_date: string;

    @IsString()
    health_insurance?: string;
} 