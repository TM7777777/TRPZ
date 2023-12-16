import { IUnitOfWork } from "../../../DAL/UnitOfWork/IUnitOfWork";
import { CandidateDTO } from "../../DTO/CandidateDTO";
import { SecurityContext } from "../../../CLL/Security/SecurityContext";
import { Candidate } from "../../../DAL/Entities/Candidate";
import { UserType } from "../../../CLL/Security/UserType.const";
import { ICandidatesService } from "../Interfaces/ICandidatesService";
import { CustomError } from "./CustomError";

const allowedUserTypesMap = {
  getCandidates: [UserType.DepartmentManager, UserType.DepartmentEmployee],
  addCandidate: [UserType.DepartmentManager],
  deleteCandidate: [UserType.DepartmentManager],
};

export class CandidatesService implements ICandidatesService {
  private readonly _database: IUnitOfWork;

  constructor(unitOfWork: IUnitOfWork) {
    if (!unitOfWork) {
      throw new Error(CustomError.unitOfWorkIsRequired);
    }
    this._database = unitOfWork;
  }

  public async getCandidates(): Promise<CandidateDTO[]> {
    const user = SecurityContext.getUser();
    const allowedUserTypes = allowedUserTypesMap[this.getCandidates.name];

    if (!allowedUserTypes.includes(user.userType)) {
      throw new Error(CustomError.methodAccesDenied);
    }

    const candidatesEntities = await this._database.candidatesRepository.getAll();

    if (!candidatesEntities) {
      throw new Error(CustomError.common);
    }

    const candidatesDto = candidatesEntities.map(({ candidate_id, resume, user_id }) => ({
      candidate_id,
      resume,
      user_id,
    }));

    return candidatesDto;
  }

  public async addCandidate(candidate: Candidate): Promise<CandidateDTO> {
    const user = SecurityContext.getUser();
    const allowedUserTypes = allowedUserTypesMap[this.addCandidate.name];

    if (!allowedUserTypes.includes(user.userType)) {
      throw new Error(CustomError.methodAccesDenied);
    }

    const candidateEntity = await this._database.candidatesRepository.createAndSave(candidate);

    if (!candidateEntity) {
      throw new Error(CustomError.common);
    }

    const { candidate_id, resume, user_id } = candidateEntity;

    return { candidate_id, resume, user_id };
  }

  public async deleteCandidate(candidate_id: Candidate["candidate_id"]): Promise<void> {
    const user = SecurityContext.getUser();

    const allowedUserTypes = allowedUserTypesMap[this.deleteCandidate.name];

    if (!allowedUserTypes.includes(user.userType)) {
      throw new Error(CustomError.methodAccesDenied);
    }

    await this._database.candidatesRepository.delete({ candidate_id });
  }
}
