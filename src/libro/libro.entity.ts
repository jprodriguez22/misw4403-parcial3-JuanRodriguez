import { Column, Entity, PrimaryColumn } from 'typeorm'

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
}
