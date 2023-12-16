import { mock, instance, when, verify, spy, anything } from "ts-mockito";
import { CandidatesService } from "../BLL/Services/Impl/CandidatesService";
import { CustomError } from "../BLL/Services/Impl/CustomError";
import { SecurityContext } from "../CLL/Security/SecurityContext";
import { UserType } from "../CLL/Security/UserType.const";
import { User } from "../CLL/Security/Identity/User";
import { IUnitOfWork } from "../DAL/UnitOfWork/IUnitOfWork";

import { ICandidatesRepository } from "../DAL/Repositories/Interfaces/ICandidatesRepository";
import { Candidate } from "../DAL/Entities/Candidate";

describe("CandidatesService tests", () => {
  let service: CandidatesService;
  let unitOfWorkMock: IUnitOfWork;
  let candidatesRepositoryMock: ICandidatesRepository;
  let mockedUser = mock<User>();
  let instanceUser = instance(mockedUser);
  let mockedSecurityContext = spy(SecurityContext);

  beforeEach(() => {
    unitOfWorkMock = mock<IUnitOfWork>();

    candidatesRepositoryMock = mock<ICandidatesRepository>();

    when(unitOfWorkMock.candidatesRepository).thenReturn(instance(candidatesRepositoryMock));

    service = new CandidatesService(instance(unitOfWorkMock));
  });

  it("throw error if UnitOfWork is empty", () => {
    const nullUnitOfWork: IUnitOfWork | null = null;

    expect(() => new CandidatesService(nullUnitOfWork)).toThrow(CustomError.unitOfWorkIsRequired);
  });

  describe("getCandidates", () => {
    it("should throw an error if user is not authorized", async () => {
      when(mockedUser.userType).thenReturn(UserType.NuclearPlantEmployee);
      when(mockedSecurityContext.getUser()).thenReturn(instanceUser);
      when(candidatesRepositoryMock.getAll()).thenResolve([]);

      await expect(() => service.getCandidates()).rejects.toThrow(CustomError.methodAccesDenied);
    });

    it("should return candidates if user is authorized", async () => {
      when(mockedUser.userType).thenReturn(UserType.DepartmentEmployee);
      when(mockedSecurityContext.getUser()).thenReturn(instanceUser);

      const mockedCandidates = [
        new Candidate("1", "Resume1", "userid1"),
        new Candidate("2", "Resume2", "userid2"),
      ];
      when(candidatesRepositoryMock.getAll()).thenResolve(mockedCandidates);

      const result = await service.getCandidates();

      verify(candidatesRepositoryMock.getAll()).once();

      expect(result).toEqual(
        mockedCandidates.map((c) => ({
          candidate_id: c.candidate_id,
          resume: c.resume,
          user_id: c.user_id,
        })),
      );
    });
  });

  describe("addCandidate", () => {
    it("should throw an error if user is not authorized", async () => {
      when(mockedUser.userType).thenReturn(UserType.DepartmentEmployee);
      when(mockedSecurityContext.getUser()).thenReturn(instanceUser);

      const candidate = new Candidate("3", "Resume3", "userid3");

      await expect(() => service.addCandidate(candidate)).rejects.toThrow(
        CustomError.methodAccesDenied,
      );
    });

    it("should add a candidate if user is authorized", async () => {
      when(mockedUser.userType).thenReturn(UserType.DepartmentManager);
      when(mockedSecurityContext.getUser()).thenReturn(instanceUser);

      const candidate = new Candidate("4", "Resume4", "userid4");
      when(candidatesRepositoryMock.createAndSave(candidate)).thenResolve(candidate);

      const result = await service.addCandidate(candidate);

      verify(candidatesRepositoryMock.createAndSave(candidate)).once();
      expect(result).toEqual({
        candidate_id: candidate.candidate_id,
        resume: candidate.resume,
        user_id: candidate.user_id,
      });
    });
  });

  describe("deleteCandidate", () => {
    it("should throw an error if user is not authorized", async () => {
      when(mockedUser.userType).thenReturn(UserType.NuclearPlantEmployee);
      when(mockedSecurityContext.getUser()).thenReturn(instanceUser);

      const candidateId = "1";

      await expect(() => service.deleteCandidate(candidateId)).rejects.toThrow(
        CustomError.methodAccesDenied,
      );
    });

    it("should delete a candidate if user is authorized", async () => {
      when(mockedUser.userType).thenReturn(UserType.DepartmentManager);
      when(mockedSecurityContext.getUser()).thenReturn(instanceUser);

      const predicate = { candidate_id: "1" };

      when(candidatesRepositoryMock.delete(anything())).thenResolve();

      await service.deleteCandidate(predicate.candidate_id);

      verify(candidatesRepositoryMock.delete(anything())).once();
    });
  });
});
