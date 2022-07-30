import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log';
import { SignUpController } from '../../presentation/controllers/signup/signup';
import { Controller } from '../../presentation/protocols';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { LogControllerDecorator } from '../decorators/log';

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const bcryptAdapater = new BcryptAdapter(salt);
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const addAccountRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapater, addAccountRepository);
  const signupController = new SignUpController(
    emailValidatorAdapter,
    dbAddAccount,
  );
  const logRepository = new LogMongoRepository();
  return new LogControllerDecorator(signupController, logRepository);
};
