import { AwardCalculator } from '@service/use_case';
import { Ballot } from '@service/entity';
import { RankedWork } from '@service/value';

export class Calculator implements AwardCalculator {
  constructor() {}

  async calculate(ballots: Ballot[]): Promise<RankedWork[]> {
    throw new Error('Not implemented');
  }
}
