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
exports.UpdateAppointmentColumns1709747000003 = void 0;
class UpdateAppointmentColumns1709747000003 {
    constructor() {
        this.name = 'UpdateAppointmentColumns1709747000003';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Drop existing tables
            yield queryRunner.query(`DROP TABLE IF EXISTS "appointments" CASCADE`);
            // Create appointments table with correct column names
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
                CONSTRAINT "FK_appointments_doctor" FOREIGN KEY ("doctor_id") REFERENCES "users"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_appointments_patient" FOREIGN KEY ("patient_id") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP TABLE IF EXISTS "appointments" CASCADE`);
        });
    }
}
exports.UpdateAppointmentColumns1709747000003 = UpdateAppointmentColumns1709747000003;
