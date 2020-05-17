import { Product } from "./Product"
import { BaseEntity } from "./BaseEntity"

export class OrderItem extends BaseEntity<OrderItem>{
    code?:number
    amount:number
    productCode:number
    product?:Product
}