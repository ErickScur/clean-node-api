export class EmailInUseError extends Error {
  constructor() {
    super('The receveid email is already in use');
    this.name = 'EmailInUseError';
  }
}
