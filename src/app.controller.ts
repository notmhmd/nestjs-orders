import {
    Body,
    Controller,
    Get,
    Inject,
    Logger,
    NotFoundException,
    ParseIntPipe,
    Post,
    ValidationPipe
} from '@nestjs/common';
import {AppService} from './app.service';
import {CreateOrderDto, OrderDto} from "./data/order.dto";
import {ClientKafka, EventPattern, MessagePattern, Payload, RpcException} from "@nestjs/microservices";
import {plainToInstance} from "class-transformer";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @EventPattern('order.place')
    handleOrderCreate(@Payload(ValidationPipe) data: CreateOrderDto) {
       this.appService.getProducts(data.products).subscribe({
           next: (products) =>{this.appService.createOrder(data, products)},
           error: (err) => Logger.debug({err})
       })
    }

    @MessagePattern('order.get')
    async handleGetOrder(@Payload('orderId', ParseIntPipe) orderId: number) {
        const order = await this.appService.getOrder(orderId);
        if(!order) {
            throw new RpcException(new NotFoundException("Order was not found!"))
        }
        return JSON.stringify(plainToInstance(OrderDto, order))
    }
}
