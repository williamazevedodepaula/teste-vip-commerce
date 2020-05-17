import { Product } from "./Product";

export class Tax{

    static getProductTax(product:Partial<Product>):number{        
        return (product.price > 100) ? ((product.price||0) / 100.0)*10 : 0;
    }
}