import { Product } from "./Product"
import { BaseEntity } from "./BaseEntity"
import { Order } from "./Order"

export class OrderItem extends BaseEntity<OrderItem>{
    code?:number
    amount:number
    productCode:number
    product?:Product
    orderCode:number
    order?:Order
}