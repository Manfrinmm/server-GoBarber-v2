import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  AfterUpdate,
  AfterLoad,
} from "typeorm";

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

  @AfterUpdate()
  returnAvatarUrl(): void {
    this.avatar_url = encodeURI(
      `http://192.168.0.101:3333/files/uploads/${this.avatar}`,
    );
  }

  @AfterLoad()
  loadAvatarUrl(): void {
    if (this.avatar) {
      this.avatar_url = encodeURI(
        `http://192.168.0.101:3333/files/uploads/${this.avatar}`,
      );
    }
  }

  avatar_url: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
