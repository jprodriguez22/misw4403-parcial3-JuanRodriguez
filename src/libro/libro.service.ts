import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from 'shared/errors/business-errors';
import { LibroEntity } from './libro.entity';

@Injectable()
export class LibroService {
    constructor(
        @InjectRepository(LibroEntity)
        private readonly libroRepository: Repository<LibroEntity>
    ) { }

    async findAll(): Promise<LibroEntity[]> {
        return await this.libroRepository.find({ relations: ['bibliotecas'] })
    }

    async findOne(isbn: string): Promise<LibroEntity> {
        const libro = await this.libroRepository.findOne({ where: { isbn }, relations: ['bibliotecas'] })
        if (!libro) {
            throw new BusinessLogicException(`El libro con ISBN ${isbn} no existe en el sistema`, BusinessError.NOT_FOUND)
        }
        return libro;
    }

    async create(libro: LibroEntity): Promise<LibroEntity> {
        const checkDate = libro.fechaPublicacion <= new Date();
        if (!checkDate) {
            throw new BusinessLogicException(`El tiempo de publicación no puede ser mayor a la fecha actual`, BusinessError.PRECONDITION_FAILED)
        }
        return await this.libroRepository.save(libro);
    }

    async update(libro: LibroEntity, isbn: string): Promise<LibroEntity> {
        const libroActualizar = await this.libroRepository.findOne({ where: { isbn } })
        if (!libroActualizar) {
            throw new BusinessLogicException(`El libro con ISBN ${isbn} no existe en el sistema`, BusinessError.NOT_FOUND)
        }
        const checkDate = libro.fechaPublicacion <= new Date();
        if (!checkDate) {
            throw new BusinessLogicException(`El tiempo de publicación no puede ser mayor a la fecha actual`, BusinessError.PRECONDITION_FAILED)
        }
        return await this.libroRepository.save({...libroActualizar, ...libro});
    }

    async delete(isbn: string) {
        const libro = await this.libroRepository.findOne({ where: { isbn } })
        if (!libro) {
            throw new BusinessLogicException(`El libro con ISBN ${isbn} no existe en el sistema`, BusinessError.NOT_FOUND)
        }
        await this.libroRepository.remove(libro);
    }
    

}
