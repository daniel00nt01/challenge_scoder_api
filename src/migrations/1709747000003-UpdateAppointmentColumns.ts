import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAppointmentColumns1709747000003 implements MigrationInterface {
    name = 'UpdateAppointmentColumns1709747000003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop existing tables
        await queryRunner.query(`DROP TABLE IF EXISTS "appointments" CASCADE`);

        // Create appointments table with correct column names
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
    }
} 