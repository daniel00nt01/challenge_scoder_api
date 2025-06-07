import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateInheritance1709747000001 implements MigrationInterface {
    name = 'UpdateInheritance1709747000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop existing tables
        await queryRunner.query(`DROP TABLE IF EXISTS "appointments" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "doctors" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "patients" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);

        // Create users table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" varchar NOT NULL,
                "email" varchar NOT NULL UNIQUE,
                "password" varchar NOT NULL,
                "phone" varchar NOT NULL,
                "role" varchar NOT NULL,
                "type" varchar,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // Create doctors table
        await queryRunner.query(`
            CREATE TABLE "doctors" (
                "id" uuid PRIMARY KEY,
                "crm" varchar NOT NULL,
                "specialization" varchar NOT NULL,
                CONSTRAINT "FK_doctors_users" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);

        // Create patients table
        await queryRunner.query(`
            CREATE TABLE "patients" (
                "id" uuid PRIMARY KEY,
                "birth_date" TIMESTAMP NOT NULL,
                "health_insurance" varchar,
                CONSTRAINT "FK_patients_users" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);

        // Create appointments table
        await queryRunner.query(`
            CREATE TABLE "appointments" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "doctor_id" uuid NOT NULL,
                "patient_id" uuid NOT NULL,
                "appointment_date" TIMESTAMP NOT NULL,
                "notes" text,
                "status" appointment_status_enum NOT NULL DEFAULT 'scheduled',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_appointments_doctor" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_appointments_patient" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "appointments" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "doctors" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "patients" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
    }
} 