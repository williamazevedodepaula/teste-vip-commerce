import { Product } from "./Product";

export class Tax{

    static getProductTax(product:Partial<Product>):number{      
        if(product.manufacturing == 'imported')   return ((product.price||0) / 100.0)*15;
        return (product.price > 100) ? ((product.price||0) / 100.0)*10 : 0;
    }
}