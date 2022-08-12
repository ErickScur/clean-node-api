import { HashComparer } from '../../protocols/criptography/hash-comparer';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { AccountModel } from '../add-account/db-add-account-protocols';
import { DbAuthentication } from './db-authentication';

interface sutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositorystub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
}

const makeFakeAccount = (): AccountModel => {
  const account: AccountModel = {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password',
  };
  return account;
};

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hashedValue: string): Promise<boolean> {
      return true;
    }
  }
  return new HashComparerStub();
};

const makeSut = (): sutTypes => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async load(email: string): Promise<AccountModel> {
      const account = makeFakeAccount();
      return new Promise((resolve) => resolve(account));
    }
  }

  const hashComparerStub = makeHashComparer();
  const loadAccountByEmailRepositorystub =
    new LoadAccountByEmailRepositoryStub();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositorystub,
    hashComparerStub,
  );
  return {
    sut,
    loadAccountByEmailRepositorystub,
    hashComparerStub,
  };
};

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorystub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositorystub, 'load');
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorystub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositorystub, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorystub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositorystub, 'load')
      .mockReturnValueOnce(null);
    const accessToken = await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    expect(accessToken).toBe(null);
  });

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, 'compare');
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
  });
});
