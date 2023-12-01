import { FindOptionsWhere, DeleteResult, UpdateResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export interface IRepository<T> {
  createAndSave(item: T): Promise<T>;
  delete(id: FindOptionsWhere<T>): Promise<DeleteResult>;
  find(predicate: FindOptionsWhere<T>, pageNumber: number, pageSize: number): Promise<T[]>;
  get(predicate: FindOptionsWhere<T>): Promise<T | undefined>;
  getAll(): Promise<T[]>;
  updateEntity(
    predicate: FindOptionsWhere<T>,
    item: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult>;
}
