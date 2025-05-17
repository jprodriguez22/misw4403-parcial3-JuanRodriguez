import { TypeOrmModule } from "@nestjs/typeorm";
import { RecetaEntity } from "../../receta/receta.entity";
import { RestauranteEntity } from "../../restaurante/restaurante.entity";
import { CulturaGastronomicaEntity } from "../../cultura-gastronomica/cultura-gastronomica.entity";
import { ProductoEntity } from "../../producto/producto.entity";
import { PaisEntity } from "../../pais/pais.entity";

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [RecetaEntity, RestauranteEntity, CulturaGastronomicaEntity, ProductoEntity, PaisEntity],
        synchronize: true,
    }),
    TypeOrmModule.forFeature([RecetaEntity, RestauranteEntity, CulturaGastronomicaEntity, ProductoEntity, PaisEntity])
];
