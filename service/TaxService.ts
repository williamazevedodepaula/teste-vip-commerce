import { Product } from "../entity/Product";
import { Order } from "../entity/Order";
import { Client } from "../entity/Client";

export class TaxService{

    static getProductTax(product:Partial<Product>):number{           
        let aliquot = (product.manufacturing == 'imported') ? 0.15 : 
                      ((product.price > 100) ? 0.1 : 0);

        return +((product.price||0) * aliquot).toFixed(2);
    }

    static getOrderTax(order:Partial<Order>):number{   
        return order.itens?.reduce(
            (total,item)=>total+(
                (item.amount||0) * TaxService.getProductTax(item.product))
            ,0)||0;
    }

    static getClientTax(client:Partial<Client>):number{        
        return client.orders?.reduce(
            (total,order)=>total+TaxService.getOrderTax(order)
        ,0)||0;
    }    
}