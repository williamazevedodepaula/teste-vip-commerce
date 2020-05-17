import { ClientI } from "./ClientI";
import { BaseEntity } from "./BaseEntity";

export class Client extends BaseEntity<ClientI> implements ClientI{
    codigo:number
    nome:string
    cpf:string
    sexo?:'M'|'F'
    email:string    
}