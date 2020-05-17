import { BaseEntity } from "./BaseEntity";
import { Client } from "./Client";
import { Product } from "./Product";

export class Order extends BaseEntity<Order>{
    code:number
    date:Date  
    observation?:string  
    payment:'CASH'|'CHECK'|'CARD'
    
    client?:Client
    clientCode:number

    products?:Product[]
}