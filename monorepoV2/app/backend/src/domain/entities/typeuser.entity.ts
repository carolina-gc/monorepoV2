import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { ETypeUser } from '../enums/typeuser.enum';

export interface ITypeUser {
  typeuserID: number;
  type: ETypeUser;
  description?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

@Entity('type_users')
export class TypeUser implements ITypeUser {
  @PrimaryGeneratedColumn()
  typeuserID: number;

  @Column({
    type: 'enum',
    enum: ETypeUser,
  })
  type: ETypeUser;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;

  @OneToMany(() => User, (user) => user.typeUser)
  users: User[];
} 