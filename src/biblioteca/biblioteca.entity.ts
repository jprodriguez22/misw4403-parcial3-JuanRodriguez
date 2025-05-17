import { LibroEntity } from '../libro/libro.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm'

@Entity('biblioteca')
export class BibliotecaEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    direccion: string;

    @Column()
    ciudad: string;

    @Column()
    horaApertura: string;

    @Column()
    horaCierre: string;

    @ManyToMany(() => LibroEntity, libro => libro.bibliotecas)
    @JoinTable()
    libros: LibroEntity[];
}