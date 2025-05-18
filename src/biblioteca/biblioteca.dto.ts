import { IsArray, IsNotEmpty, IsString, IsNumber } from "class-validator";

export class BibliotecaDTO {

    @IsNumber()
    @IsNotEmpty()
    readonly id: number;

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly direccion: string;

    @IsString()
    @IsNotEmpty()
    readonly ciudad: string;

    @IsString()
    @IsNotEmpty()
    readonly horaApertura: string;

    @IsString()
    @IsNotEmpty()
    readonly horaCierre: string;

    @IsArray()
    readonly libros: string[];
}