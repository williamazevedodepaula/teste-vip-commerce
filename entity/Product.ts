import { BaseEntity } from './BaseEntity'

/**
 * Representa um produto da aplicação
 */
export class Product extends BaseEntity<Product>{
    /**
     * Código do produto. (PK)
     */
    code:number
    /**
     * Nome do produto
     */
    name:string
    /**
     * Tipo de fabricação
     * * national: Nacional
     * * imported: Importado
     */
    manufacturing:'national'|'imported'
    /**
     * Tamanho do produto
     */
    size:string
    /**
     * Preço do produto, em reais
     */
    price:number
}