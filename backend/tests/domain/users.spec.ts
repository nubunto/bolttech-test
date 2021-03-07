import { InMemoryUserRegistry } from "../../src/domain/users";

describe("Users", () => {
  let userRegistry: InMemoryUserRegistry;

  beforeEach(() => {
    userRegistry = new InMemoryUserRegistry();
  });

  it("should be able to create user in registry", async (done) => {
    await userRegistry.createUser({
      username: "someusername",
      password: "foobar",
    });
    userRegistry.__withUnderlyingStore((store) => {
      expect(store["someusername"].username).toEqual("someusername");
      done();
    });
  });

  it("should not be able to create user with the same username", async (done) => {
    await userRegistry.createUser({
      username: "auser",
      password: "foobar",
    });
    userRegistry
      .createUser({
        username: "auser",
        password: "foobar",
      })
      .then(() => done.fail())
      .catch(() => {
        done();
      });
  });
});
