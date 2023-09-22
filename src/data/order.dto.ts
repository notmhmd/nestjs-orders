import {Exclude, Expose} from "class-transformer";
import {IsNumber, IsString, IsArray } from "class-validator";

@Exclude()
export class OrderDto {
    @Expose()
    @IsNumber()
    readonly id: number;

    @Expose()
    @IsArray()
    readonly products: number[]


    @Expose()
    @IsString()
    readonly notes: string;

    @Expose()
    @IsNumber()
    readonly total_price: number;
}

@Exclude()
export class CreateOrderDto {

    @Expose()
    @IsArray()
    readonly products: number[]


    @Expose()
    @IsString()
    readonly notes: string;


    total_price?: number
}
