import { Product } from "entity/Product";
import { Client } from "entity/Client";
import { LoopBackApplication } from "loopback";
import { Order } from "entity/Order";
import * as moment from "moment";
import * as chai from 'chai';
const should = chai.should();

export interface TestDatabaseResult{
    products:Product[],
    clients:Client[],
    orders:Order[]
}

export async function SetupTestDatabase(app:any):Promise<TestDatabaseResult>{    
    const ProductModel = app.models.Produto;
    const ClientModel = app.models.Cliente;
    const OrderModel = app.models.Pedido;

    //Recria o banco, realizando drop de todas as tabelas
    await app.dataSources.db.automigrate();

    let products:Product[] = await SetupProducts();
    let clients:Client[] = await SetupClients();    
    let orders:Order[] = await SetupOrders();    

    return {
        products:products,
        clients:clients,
        orders:orders
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
    async function SetupClients():Promise<Client[]>{
        let firstClient:Client;
        let secondClient:Client;

        firstClient = await ClientModel.create(<Partial<Client>>{
            name:'William',
            cpf:'98315014030',
            email:'william@teste.com',
            gender:'M'            
        });
        firstClient.should.have.property('code').that.equals(1);

    
        secondClient = await ClientModel.create(<Partial<Client>>{
            name:'Jessica',
            cpf:'43813984087',
            email:'jessica@teste.com',
            gender:'F'
        });
        secondClient.should.have.property('code').that.equals(2);

        return [firstClient,secondClient];
    }
    async function SetupOrders():Promise<Order[]>{
        let firstOrder:Order = await OrderModel.create(<Order>{
            clientCode:1,
            date:moment().subtract(3,'days').toDate()
        });
        firstOrder.should.have.property('code').that.equals(1);
        
        let secondOrder:Order = await OrderModel.create(<Order>{
            clientCode:2,
            date:moment().subtract(2,'days').toDate()
        });
        secondOrder.should.have.property('code').that.equals(2);

        let thirdOrder:Order = await OrderModel.create(<Order>{
            clientCode:1,
            date:moment().subtract(1,'days').toDate()
        });
        thirdOrder.should.have.property('code').that.equals(3);

        let fourthOrder:Order = await OrderModel.create(<Order>{
            clientCode:2,
            date:moment().toDate()
        });
        fourthOrder.should.have.property('code').that.equals(4);

        return [firstOrder,secondOrder,thirdOrder,fourthOrder]
    }
}