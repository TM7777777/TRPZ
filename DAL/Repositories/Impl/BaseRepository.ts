import {
  Repository,
  EntityTarget,
  DataSource,
  FindOptionsWhere,
  DeleteResult,
  UpdateResult,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

import { IRepository } from "../Interfaces/IRepository";

export abstract class BaseRepository<T> implements IRepository<T> {
  private repository: Repository<T>;

  constructor(private entity: EntityTarget<T>, dataSource: DataSource) {
    this.repository = dataSource.getRepository(this.entity);
  }

  async createAndSave(item: T): Promise<T> {
    return await this.repository.save(item);
  }

  async delete(predicate: FindOptionsWhere<T>): Promise<DeleteResult> {
    return await this.repository.delete(predicate);
  }

  async find(predicate: FindOptionsWhere<T>, pageNumber = 0, pageSize = 10): Promise<T[]> {
    return await this.repository.find({
      where: predicate,
      skip: pageSize * pageNumber,
      take: pageSize,
    });
  }

  async get(predicate: FindOptionsWhere<T>): Promise<T | undefined> {
    return await this.repository.findOneBy(predicate);
  }

  async getAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async updateEntity(
    predicate: FindOptionsWhere<T>,
    item: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    return await this.repository.update(predicate, item);
  }
}
