import { type TestingModule, Test } from '@nestjs/testing';

import { LaporanController } from './laporan.controller';
import { LaporanService } from './laporan.service';

describe('LaporanController', () => {
  let controller: LaporanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LaporanController],
      providers: [LaporanService],
    }).compile();

    controller = module.get<LaporanController>(LaporanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
