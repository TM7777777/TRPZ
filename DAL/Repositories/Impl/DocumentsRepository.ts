import { DataSource } from "typeorm";
import { Document } from "../../Entities/Document";
import { IDocumentsRepository } from "../Interfaces/IDocumentsRepository";
import { BaseRepository } from "./BaseRepository";

export class DocumentsRepository extends BaseRepository<Document> implements IDocumentsRepository {
  constructor(dataSource: DataSource) {
    super(Document, dataSource)
  }
}
