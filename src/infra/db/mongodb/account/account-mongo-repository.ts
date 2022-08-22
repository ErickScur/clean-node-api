import { AddAccountRepository } from '../../../../data/protocols/db/account/add-addcount-repository';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';
import { map } from './account-mapper';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository
{
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const result = await accountCollection.insertOne(accountData);
    const account = await accountCollection.findOne(result.insertedId);

    return map(account);
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({ email });
    return account && map(account);
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const objectId = MongoHelper.parseToObjectId(id);
    await accountCollection.updateOne(
      { _id: objectId },
      {
        $set: {
          accessToken: token,
        },
      },
    );
  }
}
