import { BibliotecaEntity } from 'src/biblioteca/biblioteca.entity';
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm'

@Entity('libro')
export class LibroEntity {
    @PrimaryColumn()
    isbn: string;

    @Column()
    titulo: string;

    @Column()
    autor: string;

    @Column()
    fechaPublicacion: Date;

    @ManyToMany(() => BibliotecaEntity, biblioteca => biblioteca.libros)
    bibliotecas: BibliotecaEntity[];
}