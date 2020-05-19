import { BaseEntity } from "./BaseEntity";
import { Client } from "./Client";
import { Product } from "./Product";
import { OrderItem } from "./OrderItem";

/**
 * Representa um pedido de um cliente
 */
export class Order extends BaseEntity<Order>{
    /**
     * Código/número do pedido - (PK)
     */
    code:number
    /**
     * Data do pedido
     */
    date:Date  
    /**
     * Observação
     */
    observation?:string  
    /**
     * FOrma de pagamento.
     * * CASH: Dinheiro
     * * CHECK: Cheque
     * * CARD: Cartão
     */
    payment:'CASH'|'CHECK'|'CARD'
    /**
     * Cliente que fez o pedido. Carregado através de relacionamento (N pedidos: 1 cliente)
     */
    client?:Client
    /**
     * Código do cliente ao qual o pedido pertence. (FK)
     */
    clientCode:number

    /**
     * Itens do pedido. Carregado através de relacionamento (1 pedido : 1 cliente)
     */
    itens?:OrderItem[]
}