"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doctor = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Appointment_1 = require("./Appointment");
let Doctor = class Doctor extends User_1.User {
    constructor() {
        super();
        this.role = 'doctor';
    }
};
exports.Doctor = Doctor;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Doctor.prototype, "crm", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Doctor.prototype, "specialization", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Appointment_1.Appointment, (appointment) => appointment.doctor),
    __metadata("design:type", Array)
], Doctor.prototype, "appointments", void 0);
exports.Doctor = Doctor = __decorate([
    (0, typeorm_1.ChildEntity)(),
    __metadata("design:paramtypes", [])
], Doctor);
