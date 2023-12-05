import { DataSource, Repository } from "typeorm";
import { mock, instance, when, verify } from "ts-mockito";
import { Document } from "../../DAL/Entities/Document";
import { DocumentsRepository } from "../../DAL/Repositories/Impl/DocumentsRepository";

describe("DocumentsRepository tests", () => {
  let mockedDataSource: DataSource;
  let mockedRepository: Repository<Document>;
  let documentsRepository: DocumentsRepository;

  beforeEach(async () => {
    mockedDataSource = mock(DataSource);
    mockedRepository = mock(Repository);

    await mockedDataSource.initialize();

    const dataSourceInstance = instance(mockedDataSource);
    const repositoryInstance = instance(mockedRepository);

    when(mockedDataSource.getRepository(Document)).thenReturn(repositoryInstance);

    documentsRepository = new DocumentsRepository(dataSourceInstance);
  });

  afterAll(async () => {
    await mockedDataSource.destroy();
  });


  it("should add a document when create is called", async () => {
    const document = new Document("some-id", "some-resume", "some-user-id");

    // Setup mock behavior
    when(mockedRepository.save(document)).thenResolve(document);

    // Perform the action
    await documentsRepository.createAndSave(document);

    // Assert the expected behavior
    verify(mockedRepository.save(document)).once();
  });

  it("should remove a document when delete is called", async () => {
    const id = "some-id";
    const predicate = { id };

    // Perform the action
    await documentsRepository.delete(predicate);

    // Assert the expected behavior
    verify(mockedRepository.delete(predicate)).once();
  });

  it("should find a document when get is called", async () => {
    const id = "some-id";
    const expectedDocument = new Document(id, "11", "22");
    const predicate = { id };

    // Setup mock behavior
    when(mockedRepository.findOneBy(predicate)).thenResolve(expectedDocument);

    // Perform the action
    const result = await documentsRepository.get(predicate);

    // Assert the expected behavior
    verify(mockedRepository.findOneBy(predicate)).once();
    expect(result).toEqual(expectedDocument);
  });
});
