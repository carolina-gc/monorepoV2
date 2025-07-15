import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TypeUser } from './typeuser.entity';

export interface IUser {
  userID: number;
  name: string;
  email: string;
  password: string;
  typeUser: TypeUser;
  numberPhone: string;
  countryCode: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

@Entity('users')
export class User implements IUser {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userID: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ManyToOne(() => TypeUser, (typeUser) => typeUser.users)
  @JoinColumn({ name: 'type_user_id' })
  typeUser: TypeUser;

  @Column({ name: 'number_phone', type: 'varchar', length: 10 })
  numberPhone: string;

  @Column({ name: 'country_code', type: 'varchar', length: 5 })
  countryCode: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
  deletedAt?: Date;
} 