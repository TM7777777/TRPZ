import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('documents')
export class Document {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  constructor(id: string, title: string, content: string) {
    this.id = id;
    this.title = title;
    this.content = content;
  }

  edit(): void {}

  delete(): void {}
}
