import { Decrypter } from '../../protocols/criptography/decrypter';
import { DbLoadAccountByToken } from './db-load-account-by-token';

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct value', async () => {
    class DecrypterStub implements Decrypter {
      async decrypt(value: string): Promise<string> {
        return null;
      }
    }
    const decrypterStub = new DecrypterStub();
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');
    const sut = new DbLoadAccountByToken(decrypterStub);
    await sut.load('any_token');
    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });
});
