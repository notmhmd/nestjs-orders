import {Inject, Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {Repository} from "typeorm";
import {OrderEntity} from "./data/order.entity";
import {CreateOrderDto} from "./data/order.dto";
import {ClientKafka} from "@nestjs/microservices";

@Injectable()
export class AppService implements OnModuleInit {

    constructor(@Inject('ORDER_REPOSITORY') private orderProviders: Repository<OrderEntity>,
                @Inject('PRODUCT_MICROSERVICE') private readonly productClient: ClientKafka) {
    }

    async findAll(): Promise<OrderEntity[]> {
        return this.orderProviders.find();
    }

    async createOrder(order: CreateOrderDto, products: { price: number }[]) {
        order.total_price = products.reduce((acc, curr) => acc + curr.price, 0)
        const created = await this.orderProviders.save(order);
        Logger.debug(`order created successfully with id of ${created.id}`)
    }

    async getOrder(orderId: number): Promise<OrderEntity> {
        return await this.orderProviders.findOneBy({id: orderId});
    }

    getProducts(productIds: number[]) {
        return this.productClient.send('product.order-get', {productIds})
    }

    async onModuleInit() {
        this.productClient.subscribeToResponseOf('product.order-get')
        await this.productClient.connect()
    }

    async onModuleDestroy() {
        await this.productClient.close();
    }
}
