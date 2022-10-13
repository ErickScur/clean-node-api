import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller';
import { Controller } from '../../../../presentation/protocols';
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory';
import { makeDbAddAccount } from '../../usecases/add-account/db-add-account-factory';
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory';
import { makeSignupValidation } from './signup-validation-factory';

export const makeSignUpController = (): Controller => {
  const signupController = new SignUpController(
    makeDbAddAccount(),
    makeSignupValidation(),
    makeDbAuthentication(),
  );
  return makeLogControllerDecorator(signupController);
};
