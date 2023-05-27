import { Repository } from "typeorm";
import { Account } from "./entities/account.entity";

export interface AccountRepository extends Repository<Account> {
  this: Repository<Account>;
  getUsers(): Promise<Account[]>;
  getUser(id: number): Promise<Account>;
  findUserById(id: number): Promise<Account>;
  updateBalanceById(id: number, balance: number): Promise<Account>;
}

export const customAccountRepository: Pick<AccountRepository, any> = {
  getUser(this: Repository<Account>, id) {
    return this.findOne({ where: { id } });
  },

  getUsers(this: Repository<Account>) {
    return this.find();
  },

  findUserById(this: Repository<Account>, id: number) {
    return this.findOneBy({
      account_number: id,
    });
  },

  async updateBalanceById(this: Repository<Account>, id: number, balance: number) {
    const account = await this.findOneBy({
      account_number: id,
    });

    account.balance = balance;
    this.save(account);

    return await account;
  }
};