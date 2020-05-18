import { BaseEntity } from "./BaseEntity";
import { Client } from "./Client";
import { Product } from "./Product";
import { OrderItem } from "./OrderItem";

export class Order extends BaseEntity<Order>{
    code:number
    date:Date  
    observation?:string  
    payment:'CASH'|'CHECK'|'CARD'
    
    client?:Client
    clientCode:number

    itens?:OrderItem[]

    formatEmailBody():string{
        throw Error("Not yet implemented");
    }
}