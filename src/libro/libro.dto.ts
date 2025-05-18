import { DatabaseDefinition } from "@faker-js/faker/.";
import { IsArray, IsNotEmpty, IsString, IsDate } from "class-validator";

export class LibroDTO {

    @IsString()
    @IsNotEmpty()
    readonly isbn: string;

    @IsString()
    @IsNotEmpty()
    readonly titulo: string;

    @IsString()
    @IsNotEmpty()
    readonly autor: string;

    @IsDate()
    @IsNotEmpty()
    readonly fechaPublicacion: Date;

    @IsArray()
    readonly bibliotecas: number[];
}