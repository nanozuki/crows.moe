import { Year } from "@service/entity";

export interface YearRepository {
  find(year: number): Promise<Year>;
  findAll(): Promise<Year[]>;
}

export class YearUseCase {
  constructor(private yearRepository: YearRepository) {}

  async find(year: number): Promise<Year> {
    return this.yearRepository.find(year);
  }

  async findAll(): Promise<Year[]> {
    return this.yearRepository.findAll();
  }
}
