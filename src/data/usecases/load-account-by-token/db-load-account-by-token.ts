import { AccountModel } from '../../../domain/models/account';
import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token';
import { Decrypter } from '../../protocols/criptography/decrypter';
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
  ) {}

  async load(token: string, role?: string): Promise<AccountModel> {
    const accessToken = await this.decrypter.decrypt(token);
    if (accessToken) {
      const account = await this.loadAccountByTokenRepository.loadByToken(
        token,
        role,
      );
      if (account) {
        return account;
      }
    }
    return null;
  }
}
