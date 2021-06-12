import { Entity, Column, BaseEntity, ManyToOne, PrimaryColumn } from "typeorm";

import { Post } from "./Post";
import { Users } from "./User";

// many <-> many
// user <-> post

@Entity()
export class Updoot extends BaseEntity {
  @Column({ type: "int" })
  value: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Users, (user) => user.updoots)
  user: Users;

  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => Post, (post) => post.updoots)
  post: Post;
}
