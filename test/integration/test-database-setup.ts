import { Product } from "entity/Product";
import { Client } from "entity/Client";
import { LoopBackApplication } from "loopback";

export interface TestDatabaseResult{
    products:Product[],
    clients:Client[]
}

export async function SetupTestDatabase(app:any):Promise<TestDatabaseResult>{    
    const ProductModel = app.models.Produto;

    //Recria o banco, realizando drop de todas as tabelas
    await app.dataSources.db.automigrate();

    let products:Product[] = await SetupProducts();

    return {
        products:products,
        clients:[]
    }

    async function SetupProducts():Promise<Product[]>{
        let firstProduct:Product;
        let secondProduct:Product;

        firstProduct = await ProductModel.create(<Partial<Product>>{
            name:'Cortina preta nacional',
            manufacturing:'national',
            size:'2.8m x 2.3m',
            price:150.00            
        });
        firstProduct.should.have.property('code').that.equals(1);
    
        secondProduct = await ProductModel.create(<Partial<Product>>{
            name:'Cortina preta nacional',
            manufacturing:'imported',
            size:'2.8m x 2.3m',
            price:300.00            
        });
        secondProduct.should.have.property('code').that.equals(2);

        return [firstProduct,secondProduct];
    }
}