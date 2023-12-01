import { DataSource } from "typeorm";

import { Candidate } from "../../Entities/Candidate";
import { ICandidatesRepository } from "../Interfaces/ICandidatesRepository";
import { BaseRepository } from "./BaseRepository";

export class CandidatesRepository extends BaseRepository<Candidate> implements ICandidatesRepository {
    constructor(dataSource: DataSource) {
        super(Candidate, dataSource)
    }
}
