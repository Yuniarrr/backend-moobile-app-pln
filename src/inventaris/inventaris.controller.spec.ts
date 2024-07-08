import { type TestingModule, Test } from '@nestjs/testing';

import { InventarisController } from './inventaris.controller';
import { InventarisService } from './inventaris.service';

describe('InventarisController', () => {
  let controller: InventarisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventarisController],
      providers: [InventarisService],
    }).compile();

    controller = module.get<InventarisController>(InventarisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
