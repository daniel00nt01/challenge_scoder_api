"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTables1709747000000 = void 0;
class CreateTables1709747000000 {
    constructor() {
        this.name = 'CreateTables1709747000000';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Users table
            yield queryRunner.query(`
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
            yield queryRunner.query(`
            CREATE TABLE "doctors" (
                "id" uuid NOT NULL,
                "crm" character varying NOT NULL,
                "specialization" character varying NOT NULL,
                CONSTRAINT "PK_doctors" PRIMARY KEY ("id"),
                CONSTRAINT "FK_doctors_users" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);
            // Patients table (extends users)
            yield queryRunner.query(`
            CREATE TABLE "patients" (
                "id" uuid NOT NULL,
                "birth_date" TIMESTAMP NOT NULL,
                "health_insurance" character varying,
                CONSTRAINT "PK_patients" PRIMARY KEY ("id"),
                CONSTRAINT "FK_patients_users" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);
            // Appointments table
            yield queryRunner.query(`
            CREATE TYPE "appointment_status_enum" AS ENUM ('scheduled', 'completed', 'cancelled')
        `);
            yield queryRunner.query(`
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
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP TABLE "appointments"`);
            yield queryRunner.query(`DROP TYPE "appointment_status_enum"`);
            yield queryRunner.query(`DROP TABLE "patients"`);
            yield queryRunner.query(`DROP TABLE "doctors"`);
            yield queryRunner.query(`DROP TABLE "users"`);
        });
    }
}
exports.CreateTables1709747000000 = CreateTables1709747000000;
