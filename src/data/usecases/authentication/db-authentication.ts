import {
  Authentication,
  AuthenticationModel,
} from '../../../domain/usecases/authentication';
import {
  LoadAccountByEmailRepository,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository,
} from './db-authentication-protocols';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
  private readonly hashComparer: HashComparer;
  private readonly encrypter: Encrypter;
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
    this.encrypter = encrypter;
    this.updateAccessTokenRepository = updateAccessTokenRepository;
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      authentication.email,
    );
    if (!account) return null;

    const isValid = await this.hashComparer.compare(
      authentication.password,
      account.password,
    );
    if (!isValid) return null;

    const accessToken = await this.encrypter.encrypt(account.id);
    await this.updateAccessTokenRepository.updateAccessToken(
      account.id,
      accessToken,
    );
    return accessToken;
  }
}
