import { LibroEntity } from 'src/libro/libro.entity';
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
    horarioAtencion: string;

    @ManyToMany(() => LibroEntity, libro => libro.isbn)
    @JoinTable()
    libros: LibroEntity[];
}