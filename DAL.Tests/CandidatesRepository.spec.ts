import { DataSource } from "typeorm";
import { Candidate } from "../DAL/Entities/Candidate";
import { CandidatesRepository } from "../DAL/Repositories/Impl/CandidatesRepository";
import { dataSourceOptions } from "./common";

describe("CandidatesRepository tests", () => {
  let dataSource: DataSource;
  let repository: CandidatesRepository;

  beforeAll(async () => {
    dataSource = new DataSource({
      ...dataSourceOptions,
      entities: [Candidate],
    });
    await dataSource.initialize();
    repository = new CandidatesRepository(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("create and save candidate", async () => {
    const candidate_id = "9e59782-ff49-493b-8007-f5757d6d95cd";

    const expectedCandidate = new Candidate(
      candidate_id,
      "test-resume",
      "482082f6-4b54-4f55-a41c-5b5f7e15d5c6",
    );

    await repository.createAndSave(expectedCandidate);

    const candidate = await repository.get({ candidate_id });

    expect(candidate).toEqual(expectedCandidate);

    // reset test
    await repository.delete({ candidate_id });
  });

  it("delete candidate by candidate_id", async () => {
    const candidate_id = "7b87c5b-6cc1-45b3-807f-7c94c93d69fa";

    const expectedCandidate = new Candidate(
      candidate_id,
      "some resume",
      "08922b21-cecc-491d-af3b-6d7ba503be94",
    );

    await repository.createAndSave(expectedCandidate);

    const candidate1 = await repository.get({ candidate_id });

    expect(candidate1).toEqual(expectedCandidate);

    await repository.delete({ candidate_id });

    const candidate2 = await repository.get({ candidate_id });

    expect(candidate2).toBeNull();
  });

  it("update candidate by candidate_id", async () => {
    const candidate_id = "646c5741-6f9c-4ca4-95c0-330ddb20a64";

    const expectedCandidate = new Candidate(
      candidate_id,
      "test-resume",
      "9b84f1a0-6ae8-473e-b8ba-6ee57a38c574",
    );

    await repository.createAndSave(expectedCandidate);

    const candidate1 = await repository.get({ candidate_id });

    expect(candidate1).toEqual(expectedCandidate);

    const updated_resume = "updated_resume";

    await repository.updateEntity({ candidate_id }, { resume: updated_resume });

    const candidate2 = await repository.get({ candidate_id });

    expect(candidate2.resume).toEqual(updated_resume);

    // reset test
    await repository.delete({ candidate_id });
  });
});
