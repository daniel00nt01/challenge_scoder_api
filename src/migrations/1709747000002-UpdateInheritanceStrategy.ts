import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateInheritanceStrategy1709747000002 implements MigrationInterface {
    name = 'UpdateInheritanceStrategy1709747000002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop existing tables
        await queryRunner.query(`DROP TABLE IF EXISTS "appointments" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "doctors" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "patients" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);

        // Create users table with type discriminator
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" varchar NOT NULL,
                "email" varchar NOT NULL UNIQUE,
                "password" varchar NOT NULL,
                "phone" varchar NOT NULL,
                "role" varchar NOT NULL,
                "type" varchar,
                "crm" varchar,
                "specialization" varchar,
                "birth_date" TIMESTAMP,
                "health_insurance" varchar,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
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
                CONSTRAINT "FK_appointments_doctor" FOREIGN KEY ("doctor_id") REFERENCES "users"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_appointments_patient" FOREIGN KEY ("patient_id") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "appointments" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
    }
} 