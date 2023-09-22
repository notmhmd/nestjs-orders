import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {Expose} from "class-transformer";
import {IsArray, IsString} from "class-validator";

@Entity()
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  total_price: number;

  @Column("int", { array: true })
  readonly products: number[]


  @Column()
  readonly notes: string;
}
