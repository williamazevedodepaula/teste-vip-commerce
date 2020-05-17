import { BaseEntity } from "./BaseEntity";

export class Client extends BaseEntity<Client>{
    code:number
    name:string
    cpf:string
    gender?:'M'|'F'
    email:string    
}