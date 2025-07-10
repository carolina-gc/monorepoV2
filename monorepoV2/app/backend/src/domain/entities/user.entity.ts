import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TypeUser } from './typeuser.entity';

export interface IUser {
  userID: number;
  name: string;
  email: string;
  password: string;
  typeUser: TypeUser;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

@Entity('users')
export class User implements IUser {
  @PrimaryGeneratedColumn()
  userID: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ManyToOne(() => TypeUser, (typeUser) => typeUser.users)
  @JoinColumn({ name: 'typeUserID' })
  typeUser: TypeUser;

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deleted_at?: Date;
} 