import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('candidates')
export class Candidate {
  @PrimaryColumn()
  candidate_id: string;

  @Column()
  resume: string;

  @Column()
  user_id: string;

  constructor(candidateId: string, resume: string, userId: string) {
    this.candidate_id = candidateId;
    this.resume = resume;
    this.user_id = userId;
  }

  apply(): void {}

  withdraw(): void {}
}
