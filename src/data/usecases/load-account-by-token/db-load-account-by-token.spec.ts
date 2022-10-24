import { AccountModel } from '../../../domain/models/account';
import { Decrypter } from '../../protocols/criptography/decrypter';
import { DbLoadAccountByToken } from './db-load-account-by-token';
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository';

const makeFakeAccount = (): AccountModel => {
  const account: AccountModel = {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password',
  };
  return account;
};

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository
  {
    async loadByToken(token: string, role?: string): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }

  return new LoadAccountByTokenRepositoryStub();
};

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return 'any_token';
    }
  }
  return new DecrypterStub();
};

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository();
  const decrypterStub = makeDecrypterStub();
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub,
  );
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub,
  };
};

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');
    await sut.load('any_token', 'any_role');
    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut();
    jest
      .spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const account = await sut.load('any_token', 'any_role');
    expect(account).toBe(null);
  });

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    const loadByTokenSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadByToken',
    );
    await sut.load('any_token', 'any_role');
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role');
  });

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const account = await sut.load('any_token', 'any_role');
    expect(account).toBe(null);
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.load('any_token', 'any_role');
    expect(account).toEqual(makeFakeAccount());
  });

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.load('any_token');

    await expect(promise).rejects.toThrow();
  });
});
