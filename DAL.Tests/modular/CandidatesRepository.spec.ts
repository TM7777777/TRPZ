import { DataSource, Repository } from "typeorm";
import { mock, instance, when, verify } from "ts-mockito";
import { Candidate } from "../../DAL/Entities/Candidate";
import { CandidatesRepository } from "../../DAL/Repositories/Impl/CandidatesRepository";

describe("CandidatesRepository tests", () => {
  let mockedDataSource: DataSource;
  let mockedRepository: Repository<Candidate>;
  let candidatesRepository: CandidatesRepository;

  beforeEach(async () => {
    mockedDataSource = mock(DataSource);
    mockedRepository = mock(Repository);

    await mockedDataSource.initialize();

    const dataSourceInstance = instance(mockedDataSource);
    const repositoryInstance = instance(mockedRepository);

    when(mockedDataSource.getRepository(Candidate)).thenReturn(repositoryInstance);

    candidatesRepository = new CandidatesRepository(dataSourceInstance);
  });

  afterAll(async () => {
    await mockedDataSource.destroy();
  });


  it("should add a candidate when create is called", async () => {
    const candidate = new Candidate("some-id", "some-resume", "some-user-id");

    // Setup mock behavior
    when(mockedRepository.save(candidate)).thenResolve(candidate);

    // Perform the action
    await candidatesRepository.createAndSave(candidate);

    // Assert the expected behavior
    verify(mockedRepository.save(candidate)).once();
  });

  it("should remove a candidate when delete is called", async () => {
    const candidate_id = "some-id";
    const predicate = { candidate_id };

    // Perform the action
    await candidatesRepository.delete(predicate);

    // Assert the expected behavior
    verify(mockedRepository.delete(predicate)).once();
  });

  it("should find a candidate when get is called", async () => {
    const candidate_id = "some-id";
    const expectedCandidate = new Candidate(candidate_id, "11", "22");
    const predicate = { candidate_id };

    // Setup mock behavior
    when(mockedRepository.findOneBy(predicate)).thenResolve(expectedCandidate);

    // Perform the action
    const result = await candidatesRepository.get(predicate);

    // Assert the expected behavior
    verify(mockedRepository.findOneBy(predicate)).once();
    expect(result).toEqual(expectedCandidate);
  });
});
