import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibroEntity } from './libro.entity';
import { LibroService } from './libro.service';

@Module({
    imports: [TypeOrmModule.forFeature([LibroEntity])],
    providers: [LibroService]
})
export class LibroModule {}
