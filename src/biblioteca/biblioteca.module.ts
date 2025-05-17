import { Module } from '@nestjs/common';
import { BibliotecaEntity } from './biblioteca.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibliotecaService } from './biblioteca.service';

@Module({
    imports: [TypeOrmModule.forFeature([BibliotecaEntity])],
    providers: [BibliotecaService],
    exports: [BibliotecaService]
})
export class BibliotecaModule {}
