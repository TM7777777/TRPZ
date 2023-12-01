import { Candidate } from "../../Entities/Candidate";
import { IRepository } from "./IRepository";

export interface ICandidatesRepository extends IRepository<Candidate> {}
