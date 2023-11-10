import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Site {
  @PrimaryGeneratedColumn()
  id_site: number;

  @Column()
  title?: string;

  @Column()
  site_name?: string;

  @Column({ nullable: true })
  icon_path?: string;

  @Column({ nullable: true })
  body_background?: string;

  @Column({ nullable: true })
  lead_name?: string;

  @Column({ nullable: true })
  lead_name_color?: string;

  @Column({ nullable: true })
  lead_subtitle?: string;

  @Column({ nullable: true })
  lead_subtitle_color?: string;
  @Column({ nullable: true })
  lead_photo_path?: string;
  @Column({ nullable: true })
  name_color?: string;
  @Column({ nullable: true })
  text_color?: string;

  @Column({ nullable: true })
  about_name?: string;

  @Column({ nullable: true })
  about_text?: string;
  @Column({ nullable: true })
  about_photo_path?: string;
  @Column({ nullable: true })
  client_name?: string;

  @Column({ nullable: true })
  client_list?: string;
  @Column({ nullable: true })
  photo_name?: string;
  @Column({ nullable: true })
  gallery_list_path?: string;

  @Column({ nullable: true })
  plus_name?: string;

  @Column({ nullable: true })
  plus_list?: string;

  @Column({ nullable: true })
  plan_name?: string;

  @Column({ nullable: true })
  plan_list?: string;

  @Column({ nullable: true })
  button_name?: string;

  @Column({ nullable: true })
  button_list?: string;

  @Column({ nullable: true })
  contact_name?: string;

  @Column({ nullable: true })
  contact_text?: string;

  @Column({ nullable: true })
  phone_number?: string;

  @Column({ nullable: true })
  vk?: string;

  @Column({ nullable: true })
  tg?: string;

  @Column({ nullable: true })
  mail?: string;

  @Column({ nullable: true })
  address_name?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  map_link?: string;
}