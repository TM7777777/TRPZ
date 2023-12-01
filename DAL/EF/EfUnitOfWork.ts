import { DataSourceOptions } from "typeorm";

import { ICandidatesRepository } from "../Repositories/Interfaces/ICandidatesRepository";
import { CandidatesRepository } from "../Repositories/Impl/CandidatesRepository";
import { IDocumentsRepository } from "../Repositories/Interfaces/IDocumentsRepository";
import { DocumentsRepository } from "../Repositories/Impl/DocumentsRepository";
import { IUnitOfWork } from "../UnitOfWork/IUnitOfWork";
import { Context } from "./Context";

export class EfUnitOfWork implements IUnitOfWork {
  private db: Context | null = null;
  private _candidatesRepository: CandidatesRepository | null = null;
  private _documentsRepository: IDocumentsRepository | null = null;

  constructor(options: DataSourceOptions) {
    this.db = new Context(options);
  }

  get candidatesRepository(): ICandidatesRepository {
    if (!this._candidatesRepository) {
      this._candidatesRepository = new CandidatesRepository(this.db);
    }
    return this._candidatesRepository;
  }

  get documentsRepository(): IDocumentsRepository {
    if (!this._documentsRepository) {
      this._documentsRepository = new DocumentsRepository(this.db);
    }
    return this._documentsRepository;
  }

  save<T>(entity: T | T[]): void {
    this.db.manager.save(entity);
  }

  private _disposed = false;

  dispose(): void {
    if (!this._disposed) {
      this.db.destroy();
      this._disposed = true;
    }
  }
}
