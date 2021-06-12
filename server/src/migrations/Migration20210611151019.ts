import { Migration } from '@mikro-orm/migrations';

export class Migration20210611151019 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" add column "email" text not null;');
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');

    this.addSql('alter table "users" add constraint "users_username_unique" unique ("username");');

    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');

    this.addSql('drop table if exists "user" cascade;');
  }

}
