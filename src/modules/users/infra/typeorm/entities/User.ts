import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  AfterUpdate,
  AfterLoad,
} from "typeorm";

import { Exclude, Expose } from "class-transformer";

import uploadConfig from "@config/upload";

@Entity("users")
class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  avatar: string;

  // @AfterUpdate()
  // returnAvatarUrl(): void {
  //   this.avatar_url = encodeURI(
  //     `http://192.168.0.101:3333/files/uploads/${this.avatar}`,
  //   );
  // }

  // @AfterLoad()
  // loadAvatarUrl(): void {
  //   if (this.avatar) {
  //     this.avatar_url = encodeURI(
  //       `http://192.168.0.101:3333/files/uploads/${this.avatar}`,
  //     );
  //   }
  // }

  // avatar_url: string;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: "avatar_url" })
  getAvatar_url(): string | null {
    if (!this.avatar) {
      return null;
    }

    switch (uploadConfig.driver) {
      case "disk":
        return encodeURI(
          `${process.env.APP_API_URL}/files/uploads/${this.avatar}`,
        );
      case "s3":
        return encodeURI(
          `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.avatar}`,
        );

      default:
        return null;
    }
  }
}

export default User;
