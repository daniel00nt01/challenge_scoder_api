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
exports.UpdateInheritance1709747000001 = void 0;
class UpdateInheritance1709747000001 {
    constructor() {
        this.name = 'UpdateInheritance1709747000001';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Drop existing tables
            yield queryRunner.query(`DROP TABLE IF EXISTS "appointments" CASCADE`);
            yield queryRunner.query(`DROP TABLE IF EXISTS "doctors" CASCADE`);
            yield queryRunner.query(`DROP TABLE IF EXISTS "patients" CASCADE`);
            yield queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
            // Create users table
            yield queryRunner.query(`
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
            yield queryRunner.query(`
            CREATE TABLE "doctors" (
                "id" uuid PRIMARY KEY,
                "crm" varchar NOT NULL,
                "specialization" varchar NOT NULL,
                CONSTRAINT "FK_doctors_users" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);
            // Create patients table
            yield queryRunner.query(`
            CREATE TABLE "patients" (
                "id" uuid PRIMARY KEY,
                "birth_date" TIMESTAMP NOT NULL,
                "health_insurance" varchar,
                CONSTRAINT "FK_patients_users" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);
            // Create appointments table
            yield queryRunner.query(`
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
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP TABLE IF EXISTS "appointments" CASCADE`);
            yield queryRunner.query(`DROP TABLE IF EXISTS "doctors" CASCADE`);
            yield queryRunner.query(`DROP TABLE IF EXISTS "patients" CASCADE`);
            yield queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
        });
    }
}
exports.UpdateInheritance1709747000001 = UpdateInheritance1709747000001;
