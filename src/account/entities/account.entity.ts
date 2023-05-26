import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('account')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column()
  account_number: number;

  @Column()
  balance: number;

  @Column()
  account_type: string;
}
