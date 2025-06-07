import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    TableInheritance,
  } from 'typeorm';
  import { Exclude } from 'class-transformer';
  
  @Entity('users')
  @TableInheritance({ column: { type: "varchar", name: "type" } })
  export abstract class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column()
    name!: string;
  
    @Column({ unique: true })
    email!: string;
  
    @Column()
    @Exclude()
    password!: string;
  
    @Column()
    phone!: string;
  
    @Column()
    role!: 'doctor' | 'patient';
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  }
  