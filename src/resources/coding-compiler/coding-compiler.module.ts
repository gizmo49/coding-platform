import { Module } from '@nestjs/common';
import { CodingCompilerService } from './service/coding-compiler.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [CodingCompilerService],
  exports: [CodingCompilerService],
})
export class CodingCompilerModule {}
