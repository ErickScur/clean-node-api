import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
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
    const controllerStub = new ControllerStub();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    const sut = new LogControllerDecorator(controllerStub);
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
