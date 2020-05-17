import { Product } from "./Product";
import { Order } from "./Order";
import { Client } from "./Client";

export class Tax{

    static getProductTax(product:Partial<Product>):number{   
        let aliquot = (product.manufacturing == 'imported') ? 0.15 : 
                      ((product.price > 100) ? 0.1 : 0);

        return +((product.price||0) * aliquot).toFixed(2);
    }

    static getOrderTax(order:Partial<Order>):number{
        return order.itens?.reduce((total,item)=>total+Tax.getProductTax(item.product),0)||0;
    }

    static getClientTax(client:Partial<Client>):number{
        return client.orders?.reduce((total,order)=>total+Tax.getOrderTax(order),0)||0;
    }
}