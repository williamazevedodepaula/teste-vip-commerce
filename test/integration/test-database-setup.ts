import { Product } from "entity/Product";
import { Client } from "entity/Client";
import { LoopBackApplication } from "loopback";
import { Order } from "entity/Order";
import * as moment from "moment";
import * as chai from 'chai';
import { OrderItem } from "entity/OrderItem";
const should = chai.should();

export interface TestDatabaseResult{
    products:Product[],
    clients:Client[],
    orders:Order[]
}

export async function SetupTestDatabase(app:any):Promise<TestDatabaseResult>{    
    if(process.env.NODE_ENV != 'test'){
        throw Error("Testes de integração devem ser executados apenas em ambiente de TESTE, para evitar limpeza indesejada do banco de dados");
    }
    
    const ProductModel = app.models.Produto;
    const ClientModel = app.models.Cliente;
    const OrderModel = app.models.Pedido;
    const OrderItemModel = app.models.ItemPedido;

    //Recria o banco, realizando drop de todas as tabelas
    await app.dataSources.db.automigrate('itemPedido');
    await app.dataSources.db.automigrate('pedido');
    await app.dataSources.db.automigrate('produto');
    await app.dataSources.db.automigrate('cliente');
    await app.dataSources.db.autoupdate();

    let products:Product[] = await SetupProducts();
    let clients:Client[] = await SetupClients();    
    let orders:Order[] = await SetupOrders();    

    return {
        products:products,
        clients:clients,
        orders:orders
    }

    async function SetupProducts():Promise<Product[]>{
        let product:Product;
        let result:Product[] = [];

        product = await ProductModel.create(<Partial<Product>>{
            name:'Cortina preta nacional',
            manufacturing:'national',
            size:'2.8m x 2.3m',
            price:150.00
        });
        product.should.have.property('code').that.equals(1);
        result.push(product);
    
        product = await ProductModel.create(<Partial<Product>>{
            name:'Cortina preta importada',
            manufacturing:'imported',
            size:'2.8m x 2.3m',
            price:300.00            
        });
        product.should.have.property('code').that.equals(2);
        result.push(product);


        product = await ProductModel.create(<Partial<Product>>{
            name:'porta lápis importado',
            manufacturing:'imported',
            size:'10cm x 10cm x 10cm',
            price:30
        });
        product.should.have.property('code').that.equals(3);
        result.push(product);

        product = await ProductModel.create(<Partial<Product>>{
            name:'porta lápis nacional',
            manufacturing:'national',
            size:'10cm x 10cm x 10cm',
            price:20
        });
        product.should.have.property('code').that.equals(4);
        result.push(product);

        return result;
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
            payment:'CASH',
            date:moment().subtract(3,'days').toDate()
        });
        firstOrder = (<any>firstOrder).toJSON();
        firstOrder.itens = await OrderItemModel.create(<OrderItem[]>[
            {
                amount:3,
                orderCode:firstOrder.code,
                productCode:1
            },
            {
                amount:1,
                orderCode:firstOrder.code,
                productCode:2
            }
        ])
        firstOrder.should.have.property('code').that.equals(1);
        //-----------------------------------------------------------
        
        let secondOrder:Order = await OrderModel.create(<Order>{
            clientCode:2,
            payment:'CHECK',
            date:moment().subtract(2,'days').toDate()
        });        
        secondOrder = (<any>secondOrder).toJSON();
        secondOrder.itens = await OrderItemModel.create(<OrderItem[]>[
            {
                amount:2,
                orderCode:secondOrder.code,
                productCode:1
            },
            {
                amount:3,
                orderCode:secondOrder.code,
                productCode:2
            }
        ])
        secondOrder.should.have.property('code').that.equals(2);
        //-----------------------------------------------------------

        let thirdOrder:Order = await OrderModel.create(<Order>{
            payment:'CARD',
            clientCode:1,
            date:moment().subtract(1,'days').toDate()
        });
        thirdOrder = (<any>thirdOrder).toJSON();
        thirdOrder.itens = await OrderItemModel.create(<OrderItem[]>[
            {
                amount:2,
                orderCode:thirdOrder.code,
                productCode:1
            },
            {
                amount:3,
                orderCode:thirdOrder.code,
                productCode:2
            }
        ])
        thirdOrder.should.have.property('code').that.equals(3);
        //-----------------------------------------------------------

        let fourthOrder:Order = await OrderModel.create(<Order>{
            payment:'CASH',
            clientCode:2,
            date:moment().toDate()
        });
        fourthOrder = (<any>fourthOrder).toJSON();
        fourthOrder.itens = await OrderItemModel.create(<OrderItem[]>[
            {
                amount:2,
                orderCode:fourthOrder.code,
                productCode:1
            },
            {
                amount:3,
                orderCode:fourthOrder.code,
                productCode:2
            }
        ])
        fourthOrder.should.have.property('code').that.equals(4);
        //-----------------------------------------------------------

        return [firstOrder,secondOrder,thirdOrder,fourthOrder]
    }
}