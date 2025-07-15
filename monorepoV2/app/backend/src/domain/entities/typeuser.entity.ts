import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { ETypeUser } from '../enums/typeuser.enum';

export interface ITypeUser {
  typeUserID: number;
  type: ETypeUser;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

@Entity('type_users')
export class TypeUser implements ITypeUser {
  @PrimaryGeneratedColumn({ name: 'type_user_id' })
  typeUserID: number;

  @Column({ type: 'enum', enum: ETypeUser })
  type: ETypeUser;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => User, (user) => user.typeUser)
  users: User[];
} 