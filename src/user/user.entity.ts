import { Landing } from "src/landing/landing.entity";
import { Entity, Column, PrimaryGeneratedColumn,
  UpdateDateColumn, CreateDateColumn, OneToMany } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Landing, (landing) => landing.user)
  landings: Landing[]

  @CreateDateColumn({ type: 'timestamp' })
  createDate: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateDate: Date;
}