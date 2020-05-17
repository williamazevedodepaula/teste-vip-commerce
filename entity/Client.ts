import { BaseEntity } from "./BaseEntity";
import { Order } from "./Order";

export class Client extends BaseEntity<Client>{
    code:number
    name:string
    cpf:string
    gender?:'M'|'F'
    email:string 
       
    orders?:Order[]
}