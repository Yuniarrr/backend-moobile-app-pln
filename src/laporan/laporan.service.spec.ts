import { type TestingModule, Test } from '@nestjs/testing';

import { LaporanService } from './laporan.service';

describe('LaporanService', () => {
  let service: LaporanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LaporanService],
    }).compile();

    service = module.get<LaporanService>(LaporanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
