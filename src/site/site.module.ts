import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { Site } from './site.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Site])],
  //exports: [TypeOrmModule],
  providers: [SiteService],
  controllers: [SiteController],
})
export class SiteModule {}

// import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
// //import { User } from '../user/user.model';

// @Entity()
// export class Site extends BaseEntity {
//   @PrimaryGeneratedColumn()
//   id_site: number;

//   @Column()
//   title?: string;

//   @Column()
//   site_name?: string;

//   @Column({ nullable: true })
//   icon_path?: string;

//   @Column({ nullable: true })
//   body_background?: string;

//   @Column({ nullable: true })
//   lead_name?: string;

//   @Column({ nullable: true })
//   lead_name_color?: string;

//   @Column({ nullable: true })
//   lead_subtitle?: string;

//   @Column({ nullable: true })
//   lead_subtitle_color?: string;
//   @Column({ nullable: true })
//   lead_photo_path?: string;
//   @Column({ nullable: true })
//   name_color?: string;
//   @Column({ nullable: true })
//   text_color?: string;

//   @Column({ nullable: true })
//   about_name?: string;

//   @Column({ nullable: true })
//   about_text?: string;
//   @Column({ nullable: true })
//   about_photo_path?: string;
//   @Column({ nullable: true })
//   client_name?: string;

//   @Column({ nullable: true })
//   client_list?: string;
//   @Column({ nullable: true })
//   photo_name?: string;
//   @Column({ nullable: true })
//   gallery_list_path?: string;

//   @Column({ nullable: true })
//   plus_name?: string;

//   @Column({ nullable: true })
//   plus_list?: string;

//   @Column({ nullable: true })
//   plan_name?: string;

//   @Column({ nullable: true })
//   plan_list?: string;

//   @Column({ nullable: true })
//   button_name?: string;

//   @Column({ nullable: true })
//   button_list?: string;

//   @Column({ nullable: true })
//   contact_name?: string;

//   @Column({ nullable: true })
//   contact_text?: string;

//   @Column({ nullable: true })
//   phone_number?: string;

//   @Column({ nullable: true })
//   vk?: string;

//   @Column({ nullable: true })
//   tg?: string;

//   @Column({ nullable: true })
//   mail?: string;

//   @Column({ nullable: true })
//   address_name?: string;

//   @Column({ nullable: true })
//   address?: string;

//   @Column({ nullable: true })
//   map_link?: string;

//   // @ManyToOne(() => User, (user) => user.id_sites)
//   //   id_user: User;

//   constructor(
//     title?: string,
//     site_name?: string,
//     icon_path?: string,
//     body_background?: string,
//     lead_name?: string,
//     lead_name_color?: string,
//     lead_subtitle?: string,
//     lead_subtitle_color?: string,
//     lead_photo_path?: string,
//     name_color?: string,
//     text_color?: string,
//     about_name?: string,
//     about_text?: string,
//     about_photo_path?: string,
//     client_name?: string,
//     client_list?: string,
//     photo_name?: string,
//     gallery_list_path?: string,
//     plus_name?: string,
//     plus_list?: string,
//     plan_name?: string,
//     plan_list?: string,
//     button_name?: string,
//     button_list?: string,
//     contact_name?: string,
//     contact_text?: string,
//     phone_number?: string,
//     vk?: string,
//     tg?: string,
//     mail?: string,
//     address_name?: string,
//     address?: string,
//     map_link?: string,
//     id_site?: number
//   ) {
//     super();
//     this.id_site = id_site;
//     this.title = title;
//     this.site_name = site_name;
//     this.icon_path = icon_path;
//     this.body_background = body_background;
//     this.lead_name = lead_name;
//     this.lead_name_color = lead_name_color;
//     this.lead_subtitle = lead_subtitle;
//     this.lead_subtitle_color = lead_subtitle_color;
//     this.lead_photo_path = lead_photo_path;
//     this.name_color = name_color;
//     this.text_color = text_color;
//     this.about_name = about_name;
//     this.about_text = about_text;
//     this.about_photo_path = about_photo_path;
//     this.client_name = client_name;
//     this.client_list = client_list;
//     this.photo_name = photo_name;
//     this.gallery_list_path = gallery_list_path;
//     this.plus_name = plus_name;
//     this.plus_list = plus_list;
//     this.plan_name = plan_name;
//     this.plan_list = plan_list;
//     this.button_name = button_name;
//     this.button_list = button_list;
//     this.contact_name = contact_name;
//     this.contact_text = contact_text;
//     this.phone_number = phone_number;
//     this.vk = vk;
//     this.tg = tg;
//     this.mail = mail;
//     this.address_name = address_name;
//     this.address = address;
//     this.map_link = map_link;
//   }
//   getIdSite(): number {
//     return this.id_site;
//   }
// }

// import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// @Entity()
// export class Site extends BaseEntity {
//   @PrimaryGeneratedColumn()
//   id_site: number;

//   @Column()
//   title?: string;

//   @Column()
//   site_name?: string;

//   @Column({ nullable: true })
//   icon?: string;
//   // @Column('varchar', { array: true })
//   // icon: Express.Multer.File[];
//   // @Column()
//   // icon?: string[];
//   // @Column('varchar', { array: true, nullable: true })
//   // icon?: string[];

//   @Column({ nullable: true })
//   body_background?: string;

//   @Column({ nullable: true })
//   lead_name?: string;

//   @Column({ nullable: true })
//   lead_name_color?: string;

//   @Column({ nullable: true })
//   lead_subtitle?: string;

//   @Column({ nullable: true })
//   lead_subtitle_color?: string;
//   @Column({ nullable: true })
//   lead_photo?: string;
//   @Column({ nullable: true })
//   name_color?: string;
//   @Column({ nullable: true })
//   text_color?: string;

//   @Column({ nullable: true })
//   about_name?: string;

//   @Column({ nullable: true })
//   about_text?: string;
//   @Column({ nullable: true })
//   about_photo?: string;
//   @Column({ nullable: true })
//   client_name?: string;

//   @Column({ nullable: true })
//   client_list?: string;
//   @Column({ nullable: true })
//   photo_name?: string;
//   @Column({ nullable: true })
//   photo_path_list?: string;
//   // @Column('varchar', { array: true })
//   // photo_path_list: Express.Multer.File[];
//   // @Column()
//   // photo_path_list?: string[];
//   // @Column('varchar', { array: true, nullable: true })
//   // photo_path_list?: string[];

//   @Column({ nullable: true })
//   plus_name?: string;

//   @Column({ nullable: true })
//   plus_list?: string;

//   @Column({ nullable: true })
//   plan_name?: string;

//   @Column({ nullable: true })
//   plan_list?: string;

//   @Column({ nullable: true })
//   button_name?: string;

//   @Column({ nullable: true })
//   button_list?: string;

//   @Column({ nullable: true })
//   contact_name?: string;

//   @Column({ nullable: true })
//   contact_text?: string;

//   @Column({ nullable: true })
//   phone_number?: string;

//   @Column({ nullable: true })
//   vk?: string;

//   @Column({ nullable: true })
//   tg?: string;

//   @Column({ nullable: true })
//   mail?: string;

//   @Column({ nullable: true })
//   address_name?: string;

//   @Column({ nullable: true })
//   address?: string;

//   @Column({ nullable: true })
//   map_link?: string;

//   constructor(
//     title?: string,
//     site_name?: string,
//     //icon?: Express.Multer.File[],
//     icon?: string,
//     //icon?: string[],
//     body_background?: string,
//     lead_name?: string,
//     lead_name_color?: string,
//     lead_subtitle?: string,
//     lead_subtitle_color?: string,
//     lead_photo?: string,
//     name_color?: string,
//     text_color?: string,
//     about_name?: string,
//     about_text?: string,
//     about_photo?: string,
//     client_name?: string,
//     client_list?: string,
//     photo_name?: string,
//     //photo_path_list?: Express.Multer.File[],
//     photo_path_list?: string,
//     //photo_path_list?: string[],
//     plus_name?: string,
//     plus_list?: string,
//     plan_name?: string,
//     plan_list?: string,
//     button_name?: string,
//     button_list?: string,
//     contact_name?: string,
//     contact_text?: string,
//     phone_number?: string,
//     vk?: string,
//     tg?: string,
//     mail?: string,
//     address_name?: string,
//     address?: string,
//     map_link?: string,
//     id_site?: number
//   ) {
//     super();
//     this.id_site = id_site;
//     this.title = title;
//     this.site_name = site_name;
//     this.icon = icon;
//     this.body_background = body_background;
//     this.lead_name = lead_name;
//     this.lead_name_color = lead_name_color;
//     this.lead_subtitle = lead_subtitle;
//     this.lead_subtitle_color = lead_subtitle_color;
//     this.lead_photo = lead_photo;
//     this.name_color = name_color;
//     this.text_color = text_color;
//     this.about_name = about_name;
//     this.about_text = about_text;
//     this.about_photo = about_photo;
//     this.client_name = client_name;
//     this.client_list = client_list;
//     this.photo_name = photo_name;
//     this.photo_path_list = photo_path_list;
//     this.plus_name = plus_name;
//     this.plus_list = plus_list;
//     this.plan_name = plan_name;
//     this.plan_list = plan_list;
//     this.button_name = button_name;
//     this.button_list = button_list;
//     this.contact_name = contact_name;
//     this.contact_text = contact_text;
//     this.phone_number = phone_number;
//     this.vk = vk;
//     this.tg = tg;
//     this.mail = mail;
//     this.address_name = address_name;
//     this.address = address;
//     this.map_link = map_link;
//   }
//   getIdSite(): number {
//     return this.id_site;
//   }
// }