import { Module } from '@nestjs/common';
import { DealersService } from './dealers.service';

@Module({
  providers: [DealersService]
})
export class DealersModule {}
