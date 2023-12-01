import { DataSource } from "typeorm";
import { Document } from "../DAL/Entities/Document";
import { DocumentsRepository } from "../DAL/Repositories/Impl/DocumentsRepository";
import { dataSourceOptions } from "./common";

describe("DocumentsRepository tests", () => {
  let dataSource: DataSource;
  let repository: DocumentsRepository;

  beforeAll(async () => {
    dataSource = new DataSource({
      ...dataSourceOptions,
      entities: [Document],
    });
    await dataSource.initialize();
    repository = new DocumentsRepository(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("create and save document", async () => {
    const document_id = "7f81582c-1a9c-4610-bb91-6a67f596826";

    const expectedDocument = new Document(document_id, "some title", "some content");

    await repository.createAndSave(expectedDocument);

    const candidate = await repository.get({ id: document_id });

    expect(candidate).toEqual(expectedDocument);

    // reset test
    await repository.delete({ id: document_id });
  });

  it("delete document by document id", async () => {
    const document_id = "179f6562-0d3f-45f6-8a02-6ad8ecb3415";

    const expectedDocument = new Document(document_id, "that's a title", "that's a content");

    await repository.createAndSave(expectedDocument);

    const candidate1 = await repository.get({ id: document_id });

    expect(candidate1).toEqual(expectedDocument);

    await repository.delete({ id: document_id });

    const candidate2 = await repository.get({ id: document_id });

    expect(candidate2).toBeNull();
  });

  it("update document by document id", async () => {
    const document_id = "c7a063cf-9a1b-40fb-bc03-78841939621";

    const expectedDocument = new Document(document_id, "TITLETITLE", "CONTENT____");

    await repository.createAndSave(expectedDocument);

    const candidate1 = await repository.get({ id: document_id });

    expect(candidate1).toEqual(expectedDocument);

    const updated_title = "updated_title";
    const updated_content = "updated_content";

    await repository.updateEntity(
      { id: document_id },
      { title: updated_title, content: "updated_content" },
    );

    const candidate2 = await repository.get({ id: document_id });

    expect(candidate2.title).toEqual(updated_title);
    expect(candidate2.content).toEqual(updated_content);

    // reset test
    await repository.delete({ id: document_id });
  });
});
