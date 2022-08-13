import { HashComparer } from '../../protocols/criptography/hash-comparer';
import { TokenGenerator } from '../../protocols/criptography/token-generator';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { AccountModel } from '../add-account/db-add-account-protocols';
import { DbAuthentication } from './db-authentication';

interface sutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositorystub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  tokenGeneratorStub: TokenGenerator;
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

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }
  return new TokenGeneratorStub();
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
  const tokenGeneratorStub = makeTokenGenerator();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositorystub,
    hashComparerStub,
    tokenGeneratorStub,
  );
  return {
    sut,
    loadAccountByEmailRepositorystub,
    hashComparerStub,
    tokenGeneratorStub,
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

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)));
    const accessToken = await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    expect(accessToken).toBe(null);
  });

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    expect(generateSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    jest
      .spyOn(tokenGeneratorStub, 'generate')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    await expect(promise).rejects.toThrow();
  });
});
