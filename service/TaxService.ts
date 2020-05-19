import { Product } from "../entity/Product";
import { Order } from "../entity/Order";
import { Client } from "../entity/Client";

/**
 * Classe para execução de métodos puros de serviço relacionados a cálculo de impostos
 */
export class TaxService{

    /**
     * Calculoa o valor de imposto pago por um produto:
     * * Produto nacinal, preço > R$ 100.00: Valor * 10%
     * * Produto nacinal, preço <= R$ 100.00: 0
     * * Produto importadp: Valor * 15%
     * @param product o produto a ter imposto calculado
     * @return o valor do imposto pago referente ao produto
     */
    static getProductTax(product:Partial<Product>):number{           
        let aliquot = (product.manufacturing == 'imported') ? 0.15 : 
                      ((product.price > 100) ? 0.1 : 0);

        return +((product.price||0) * aliquot).toFixed(2);
    }

    /**
     * Calculoa o valor total de impostos pago em um pedido.
     * (somatório dos impostos dos produtos nos itens do pedido)
     * @param order o pedido a ter imposto calculado
     * @return o valor do imposto pago referente ao pedido
     */
    static getOrderTax(order:Partial<Order>):number{   
        return order.itens?.reduce(
            (total,item)=>total+(
                (item.amount||0) * TaxService.getProductTax(item.product))
            ,0)||0;
    }

    /**
     * Calculoa o valor total de impostos pago por um cliente
     * (somatório dos impostos dos pedidos).
     * O calculo será feito sobre todos os pedidos carregados no relacionamento com o cliente.
     * @param client o cliente a ter imposto calculado
     * @return o valor do imposto pago pelo cliente
     */
    static getClientTax(client:Partial<Client>):number{        
        return client.orders?.reduce(
            (total,order)=>total+TaxService.getOrderTax(order)
        ,0)||0;
    }    
}