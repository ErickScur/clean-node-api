import { AccountModel } from '../../../../domain/models/account';

export const map = (account: any): AccountModel => {
  const { _id, ...accountWithouthId } = account;
  return Object.assign({}, accountWithouthId, { id: _id });
};
