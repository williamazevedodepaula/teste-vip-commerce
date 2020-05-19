import { Product } from "./Product"
import { BaseEntity } from "./BaseEntity"
import { Order } from "./Order"

/**
 * Classe que representa um item de um pedido.
 * Contém dados do produto e a quantidade
 */
export class OrderItem extends BaseEntity<OrderItem>{
    /**
     * Código do item. (PK)
     */
    code?:number
    /**
     * Quantidade pedida do item
     */
    amount:number
    /**
     * Código do produto ao qual o item se refere. (FK)
     */
    productCode:number
    /**
     * Instância do produto. Carregado através do relacionamento (1 item : 1 produto)
     */
    product?:Product
    /**
     * Código do pedido ao qual o item pertence. (FK)
     */
    orderCode:number
    /**
     * Instância do pedido. Carregado pelo relacionamento: (1 item : 1 pedido)
     */
    order?:Order
}