import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication';
import { Authentication } from '../../../../domain/usecases/authentication';
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository';
import env from '../../../config/env';

export const makeDbAuthentication = (): Authentication => {
  const salt = 12;
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapater = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapater,
    jwtAdapter,
    accountMongoRepository,
  );
};
