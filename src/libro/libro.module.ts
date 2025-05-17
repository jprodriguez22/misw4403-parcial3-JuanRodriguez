import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibroEntity } from './libro.entity';

@Module({
    imports: [TypeOrmModule.forFeature([LibroEntity])]
})
export class LibroModule {}
