import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { SignUpController } from '../../presentation/controllers/signup/signup';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';

export const makeSignUpController = (): SignUpController => {
  const salt = 12;
  const bcryptAdapater = new BcryptAdapter(salt);
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const addAccountRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapater, addAccountRepository);
  return new SignUpController(emailValidatorAdapter, dbAddAccount);
};
