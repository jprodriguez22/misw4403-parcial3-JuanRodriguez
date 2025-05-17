import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BibliotecaEntity } from './biblioteca.entity';
import { BusinessError, BusinessLogicException } from 'shared/errors/business-errors';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

@Injectable()
export class BibliotecaService {
    constructor(
        @InjectRepository(BibliotecaEntity)
        private readonly bibliotecaRepository: Repository<BibliotecaEntity>
    ) { }

    async findAll(): Promise<BibliotecaEntity[]> {
        return await this.bibliotecaRepository.find({ relations: ['libros'] })
    }

    async findOne(id: number): Promise<BibliotecaEntity> {
        const biblioteca = await this.bibliotecaRepository.findOne({ where: { id }, relations: ['libros'] })
        if (!biblioteca) {
            throw new BusinessLogicException(`La biblioteca con id ${id} no existe en el sistema`, BusinessError.NOT_FOUND)
        }
        return biblioteca;
    }

    async create(biblioteca: BibliotecaEntity): Promise<BibliotecaEntity> {
        const checkValidOpeningTime = timeRegex.test(biblioteca.horaApertura);
        if (!checkValidOpeningTime) {
            throw new BusinessLogicException(`El tiempo de apertura debe estar entre 0:00 y 23:59 horas`, BusinessError.PRECONDITION_FAILED)
        }
        const checkValidClosingTime = timeRegex.test(biblioteca.horaCierre);
        if (!checkValidClosingTime) {
            throw new BusinessLogicException(`El tiempo de cierre debe ser entre 0:00 y 23:59 horas`, BusinessError.PRECONDITION_FAILED)
        }
        const [otHours, otMinutes] = biblioteca.horaApertura.split(':').map(Number);
        const [ctHours, ctMinutes] = biblioteca.horaCierre.split(':').map(Number);
        const checkOpeningTime = (ctHours * 60 + ctMinutes) > (otHours * 60 + otMinutes);
        if (!checkOpeningTime) {
            throw new BusinessLogicException(`El tiempo de apertura debe ser menor al de cierre`, BusinessError.PRECONDITION_FAILED)
        }
        return await this.bibliotecaRepository.save(biblioteca);
    }

    async update(biblioteca: BibliotecaEntity, id: number): Promise<BibliotecaEntity> {
        const bibliotecaActualizar = await this.bibliotecaRepository.findOne({ where: { id } })
        if (!bibliotecaActualizar) {
            throw new BusinessLogicException(`La biblioteca con id ${id} no existe en el sistema`, BusinessError.NOT_FOUND)
        }

        const checkValidOpeningTime = timeRegex.test(biblioteca.horaApertura);
        if (!checkValidOpeningTime) {
            throw new BusinessLogicException(`El tiempo de apertura debe estar entre 0:00 y 23:59 horas`, BusinessError.PRECONDITION_FAILED)
        }
        const checkValidClosingTime = timeRegex.test(biblioteca.horaCierre);
        if (!checkValidClosingTime) {
            throw new BusinessLogicException(`El tiempo de cierre debe ser entre 0:00 y 23:59 horas`, BusinessError.PRECONDITION_FAILED)
        }
        const [otHours, otMinutes] = biblioteca.horaApertura.split(':').map(Number);
        const [ctHours, ctMinutes] = biblioteca.horaCierre.split(':').map(Number);
        const checkOpeningTime = (ctHours * 60 + ctMinutes) > (otHours * 60 + otMinutes);
        if (!checkOpeningTime) {
            throw new BusinessLogicException(`El tiempo de apertura debe ser menor al de cierre`, BusinessError.PRECONDITION_FAILED)
        }
        return await this.bibliotecaRepository.save({...bibliotecaActualizar, ...biblioteca});
    }

    async delete(id: number) {
        const biblioteca = await this.bibliotecaRepository.findOne({ where: { id } })
        if (!biblioteca) {
            throw new BusinessLogicException(`La biblioteca con id ${id} no existe en el sistema`, BusinessError.NOT_FOUND)
        }
        await this.bibliotecaRepository.remove(biblioteca);
    }
    

}
