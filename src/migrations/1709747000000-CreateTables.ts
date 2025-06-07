import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1709747000000 implements MigrationInterface {
    name = 'CreateTables1709747000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Users table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "phone" character varying NOT NULL,
                "role" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);

        // Doctors table (extends users)
        await queryRunner.query(`
            CREATE TABLE "doctors" (
                "id" uuid NOT NULL,
                "crm" character varying NOT NULL,
                "specialization" character varying NOT NULL,
                CONSTRAINT "PK_doctors" PRIMARY KEY ("id"),
                CONSTRAINT "FK_doctors_users" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);

        // Patients table (extends users)
        await queryRunner.query(`
            CREATE TABLE "patients" (
                "id" uuid NOT NULL,
                "birth_date" TIMESTAMP NOT NULL,
                "health_insurance" character varying,
                CONSTRAINT "PK_patients" PRIMARY KEY ("id"),
                CONSTRAINT "FK_patients_users" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);

        // Appointments table
        await queryRunner.query(`
            CREATE TYPE "appointment_status_enum" AS ENUM ('scheduled', 'completed', 'cancelled')
        `);

        await queryRunner.query(`
            CREATE TABLE "appointments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "appointment_date" TIMESTAMP NOT NULL,
                "notes" text,
                "status" "appointment_status_enum" NOT NULL DEFAULT 'scheduled',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "doctor_id" uuid NOT NULL,
                "patient_id" uuid NOT NULL,
                CONSTRAINT "PK_appointments" PRIMARY KEY ("id"),
                CONSTRAINT "FK_appointments_doctor" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_appointments_patient" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "appointments"`);
        await queryRunner.query(`DROP TYPE "appointment_status_enum"`);
        await queryRunner.query(`DROP TABLE "patients"`);
        await queryRunner.query(`DROP TABLE "doctors"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
} 