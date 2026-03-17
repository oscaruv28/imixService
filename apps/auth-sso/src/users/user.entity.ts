import { Entity, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from 'src/core/base-entity';

@Entity({ tableName: 'users' })
export class UserEntity extends BaseEntity {
  @Unique()
  @Property()
  username: string;

  @Property({ hidden: true })
  password: string;

  @Unique()
  @Property()
  email: string;

  @Property({ type: 'json', nullable: true })
  financialProfile: {
    availableCredit: number;
    riskLevel: string;
    storeBranch: string;
  };

  @Property({ default: true })
  isActive = true;
}