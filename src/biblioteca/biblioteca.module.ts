import { Module } from '@nestjs/common';
import { BibliotecaEntity } from './biblioteca.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([BibliotecaEntity])]
})
export class BibliotecaModule {}
