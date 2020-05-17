import { Product } from "./Product";
import { Order } from "./Order";

export class Tax{

    static getProductTax(product:Partial<Product>):number{   
        let aliquot = (product.manufacturing == 'imported') ? 0.15 : 
                      ((product.price > 100) ? 0.1 : 0);

        return +((product.price||0) * aliquot).toFixed(2);
    }

    static getOrderTax(order:Partial<Order>):number{
        return order.products?.reduce((total,product)=>total+Tax.getProductTax(product),0)||0;
    }
}