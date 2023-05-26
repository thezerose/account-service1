import { DataSource, Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountRepository extends Repository<Account> {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {
    super(Account, dataSource.createEntityManager());
  }

  async findUserById(id: number) {
    return await this.accountRepository.findOneBy({
      account_number: id,
    });
  }

  async updateUserById(id: number, balance: number) {
    const account = await this.accountRepository.findOneBy({
      account_number: id,
    });

    account.balance = balance;
    this.accountRepository.save(account);
  }
}
