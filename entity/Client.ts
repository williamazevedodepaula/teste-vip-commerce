import { ClientI } from "./ClientI";
import { BaseEntity } from "./BaseEntity";

export class Client extends BaseEntity<ClientI> implements ClientI{
    code:number
    name:string
    cpf:string
    gender?:'M'|'F'
    email:string    
}