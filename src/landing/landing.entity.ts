import { User } from "src/user/user.entity";
import { Entity, Column, PrimaryGeneratedColumn,
  UpdateDateColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class Landing {
  @PrimaryGeneratedColumn()
  id_landing: number;

  @ManyToOne(() => User, (user)=> user.landings)
  @JoinColumn({name: 'id_user'})
  user: User

  @Column()
  title: string;

  @Column()
  site_name: string;

  @Column({ nullable: true })
  body_background?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createDate: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateDate: Date;
}