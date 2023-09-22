import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {orderProviders} from "./data/order.provider";
import { DatabaseModule } from './database/database.module';
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
    imports: [
        DatabaseModule,
        ClientsModule.register([
            {
                name: 'PRODUCT_MICROSERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'order-product-consumer',
                        brokers: ['kafka:9092'],
                    },
                    consumer: {
                        groupId: 'product-consumer',
                    },
                },
            },
        ]),
    ],
    controllers: [AppController],
    providers: [...orderProviders, AppService],
})
export class AppModule {
}
