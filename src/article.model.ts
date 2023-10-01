import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title?: string;

  @Column()
  site_name?: string;

  @Column()
  icon?: string;

  @Column()
  body_background?: string;

  @Column()
  lead_name?: string;

  @Column()
  lead_name_color?: string;

  @Column()
  lead_subtitle?: string;

  @Column()
  lead_subtitle_color?: string;
  @Column()
  lead_photo?: string;
  @Column()
  name_color?: string;
  @Column()
  text_color?: string;

  @Column()
  about_name?: string;

  @Column()
  about_text?: string;
  @Column()
  about_photo?: string;
  @Column()
  client_name?: string;

  @Column()
  client_list?: string;
  @Column()
  photo_name?: string;
  @Column()
  photo_path_list?: string;
  @Column()
  plus_name?: string;

  @Column()
  plus_list?: string;

  @Column()
  plan_name?: string;

  @Column()
  plan_list?: string;

  @Column()
  button_name?: string;

  @Column()
  button_list?: string;

  @Column()
  contact_name?: string;

  @Column()
  contact_text?: string;

  @Column()
  phone_number?: string;

  @Column()
  vk?: string;

  @Column()
  tg?: string;

  @Column()
  mail?: string;

  @Column()
  address_name?: string;

  @Column()
  address?: string;

  @Column()
  map_link?: string;

  constructor(
      title?: string,
      site_name?: string,
      icon?: string,
      body_background?: string,
      lead_name?: string,
      lead_name_color?: string,
      lead_subtitle?: string,
      lead_subtitle_color?: string,
      lead_photo?: string,
      name_color?: string,
      text_color?: string,
      about_name?: string,
      about_text?: string,
      about_photo?: string,
      client_name?: string,
      client_list?: string,
      photo_name?: string,
      photo_path_list?: string,
      plus_name?: string,
      plus_list?: string,
      plan_name?: string,
      plan_list?: string,
      button_name?: string,
      button_list?: string,
      contact_name?: string,
      contact_text?: string,
      phone_number?: string,
      vk?: string,
      tg?: string,
      mail?: string,
      address_name?: string,
      address?: string,
      map_link?: string,
      id?: number,
  ) {
    super();
    this.id = id;
    this.title = title;
    this.site_name = site_name;
    this.icon = icon;
    this.body_background = body_background;
    this.lead_name = lead_name;
    this.lead_name_color = lead_name_color;
    this.lead_subtitle = lead_subtitle;
    this.lead_subtitle_color = lead_name_color;
    this.lead_photo = lead_photo;
    this.name_color = name_color;
    this.text_color = text_color;
    this.about_name = about_name;
    this.about_text = about_text;
    this.about_photo = about_photo;
    this.client_name = client_name;
    this.client_list = client_list;
    this.photo_name = photo_name;
    this.photo_path_list = photo_path_list;
    this.plus_name = plus_name;
    this.plus_list = plus_list;
    this.plan_name = plan_name;
    this.plan_list = plan_list;
    this.button_name = button_name;
    this.button_list = button_list;
    this.contact_name = contact_name;
    this.contact_text = contact_text;
    this.phone_number = phone_number;
    this.vk = vk;
    this.tg = tg;
    this.mail = mail;
    this.address_name = address_name;
    this.address = address;
    this.map_link = map_link;
  }
  getId(): number {
    return this.id;
  }
}
