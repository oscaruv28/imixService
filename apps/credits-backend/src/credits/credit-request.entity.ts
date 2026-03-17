import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/core/base-entity';

@Entity({ collection: 'credit_requests' })
export class CreditRequest extends BaseEntity {
  @Property()
  amount: number;

  @Property()
  applicantId: string;

  @Property()
  status: string = 'processing';

  @Property({ nullable: true })
  aiScore?: number;

  @Property({ nullable: true, type: 'text' })
  aiAnalysis?: string;
}