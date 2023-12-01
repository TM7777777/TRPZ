import { DataSource, DataSourceOptions, Repository } from "typeorm";
import { Candidate } from "../Entities/Candidate";
import { Document } from "../Entities/Document";

export class Context extends DataSource {
  candidatesRepository: Repository<Candidate>;
  documentsRepository: Repository<Document>;

  constructor(options: DataSourceOptions) {
    super(options);
    this.candidatesRepository = this.getRepository(Candidate);
    this.documentsRepository = this.getRepository(Document);
  }
}
