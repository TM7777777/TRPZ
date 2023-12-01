import { ICandidatesRepository } from "../Repositories/Interfaces/ICandidatesRepository";
import { IDocumentsRepository } from "../Repositories/Interfaces/IDocumentsRepository";

export interface IUnitOfWork {
  readonly candidatesRepository: ICandidatesRepository;
  readonly documentsRepository: IDocumentsRepository;
  save<T>(entity: T | T[]): void;
  dispose(): void;
}
