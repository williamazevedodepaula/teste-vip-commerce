import { BaseEntity } from "./BaseEntity";
import { Order } from "./Order";

/**
 * Classe que representa um cliente da aplicação
 */
export class Client extends BaseEntity<Client>{
    /**
     * Código/número do cliente. (PK)
     */
    code:number
    /**
     * Nome do cliente
     */
    name:string
    /**
     * Cpf do cliente
     */
    cpf:string
    /**
     * Gênero do cliente. 
     * * M: Masculino
     * * F: Feminino 
     * * undefined: Não informado/indeterminado
     */
    gender?:'M'|'F'
    /**
     * Email do cliente
     */
    email:string 
       
    /**
     * Lista de pedidos do cliente (Carregados através de relacionamentos), relação de 1:N
     */
    orders?:Order[]
}