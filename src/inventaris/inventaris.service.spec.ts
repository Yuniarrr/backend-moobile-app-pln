import { type TestingModule, Test } from '@nestjs/testing';

import { InventarisService } from './inventaris.service';

describe('InventarisService', () => {
  let service: InventarisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventarisService],
    }).compile();

    service = module.get<InventarisService>(InventarisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
