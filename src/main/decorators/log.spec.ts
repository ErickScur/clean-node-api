import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

interface sutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse = {
        statusCode: 200,
        body: {
          email: 'any_mail@mail.com',
          password: 'any_password',
          name: 'any_name',
        },
      };
      return new Promise((resolve) => resolve(httpResponse));
    }
  }
  return new ControllerStub();
};

const makeSut = (): sutTypes => {
  const controllerStub = makeControllerStub();
  const sut = new LogControllerDecorator(controllerStub);
  return {
    controllerStub,
    sut,
  };
};
describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { controllerStub, sut } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');

    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        name: 'any_name',
      },
    };

    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
});
