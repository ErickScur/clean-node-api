import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return new Promise((resolve) => resolve('any_token'));
  },
}));
const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret');
};

describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = makeSut();
    const signSpy = jest.spyOn(jwt, 'sign');
    await sut.encrypt('any_value');
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_value' }, 'secret');
  });

  test('Should return a token on sign success', async () => {
    const sut = makeSut();
    const accessToken = await sut.encrypt('any_value');
    expect(accessToken).toBe('any_token');
  });
});
