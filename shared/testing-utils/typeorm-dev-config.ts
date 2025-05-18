import { TypeOrmModule } from "@nestjs/typeorm";
import { BibliotecaEntity } from "../../src/biblioteca/biblioteca.entity";
import { LibroEntity } from "../../src/libro/libro.entity";

export const TypeOrmDevConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: 'dev-db.sqlite',
        dropSchema: true,
        entities: [BibliotecaEntity, LibroEntity],
        synchronize: true,
    }),
    TypeOrmModule.forFeature([BibliotecaEntity, LibroEntity])
];
