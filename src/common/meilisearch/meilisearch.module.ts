import { Global, Module } from '@nestjs/common';
import { MeilisearchService } from './meilisearch.service';

@Global()
@Module({
  providers: [MeilisearchService],
  exports: [MeilisearchService],
  controllers: [],
})
export class MeilisearchModule {}
