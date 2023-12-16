import { Candidate } from "../../../DAL/Entities/Candidate";
import { CandidateDTO } from "../../DTO/CandidateDTO";

export interface ICandidatesService {
  getCandidates(): Promise<CandidateDTO[]>;
  addCandidate(candidate: Candidate): Promise<CandidateDTO>;
  deleteCandidate(id: Candidate["candidate_id"]): Promise<void>;
}
