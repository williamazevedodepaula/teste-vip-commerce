import { Product } from "../../entity/Product";
import * as supertest from 'supertest'
import * as chai from 'chai'
import { SetupTestDatabase, TestDatabaseResult } from "./test-database-setup";
import { Order } from "entity/Order";
import * as moment from "moment";
import { OrderItem } from "entity/OrderItem";
const expect = chai.expect;
const should = chai.should();
const assert = chai.assert;

const app = require('../../server/server');
const ProductModel = app.models.Produto;
const OrderModel = app.models.Pedido;
const OrderItemModel = app.models.ItemPedido;
const TaxModel = app.models.Imposto;

describe('Testes de Integração de Impostos',function(){
    before('Configura o banco de dados para testes',async function(){
        let testDb:TestDatabaseResult = await SetupTestDatabase(app);
    })

    before('Gera varios pedidos para um cliente, por data',async function(){
        //Apaga todos os pedidos do cliente 1, para gerar uma quantidade controlada de pedidos
        await OrderModel.destroyAll({clientOrder:1});

        await createOrder(<any>{
            clientCode:1,
            date:moment('2020-01-01').toDate(),
            payment:'CARD',
            itens:[{amount:3,productCode:1}]
        });
        await createOrder(<any>{
            clientCode:1,
            date:moment('2020-01-12').toDate(),
            payment:'CASH',
            itens:[{amount:2,productCode:1},{amount:3,productCode:2}]
        });
        await createOrder(<any>{
            clientCode:1,
            date:moment('2020-01-31').toDate(),
            payment:'CHECK',
            itens:[{amount:1,productCode:4},{amount:2,productCode:3}]
        });
        //--------_TOTAL de impostos: 210,9

        await createOrder(<any>{
            clientCode:1,
            date:moment('2020-02-01').toDate(),
            payment:'CASH',
            itens:[{amount:1,productCode:2},{amount:2,productCode:4}]
            //Imposto: 40,  0
        });        
        await createOrder(<any>{
            clientCode:1,
            date:moment('2020-02-10').toDate(),
            payment:'CARD',
            itens:[{amount:4,productCode:1},{amount:5,productCode:2},{amount:6,productCode:3}]
            //Imposto: 60,  225,  27
        });
        await createOrder(<any>{
            clientCode:1,
            date:moment('2020-02-20').toDate(),
            payment:'CARD',
            itens:[{amount:1,productCode:1},{amount:1,productCode:2},{amount:1,productCode:3},{amount:1,productCode:4}]
            //Imposto: 15, 45, 4.5,  0
        });
        //--------_TOTAL de impostos: 416,5
    })

    describe('Testes da camada de Moelo/Serviço',async function(){
        
        it('Deve existir um Modelo não-persistente para calculo de impostos',async function(){
            expect(TaxModel).not.to.be.undefined;
        })

        it('Deve calcular o total de impostos de um cliente em um mes',async function(){
            let totalJanuary  = await TaxModel.getTotalTax('2020','01');
            let totalFebruary = await TaxModel.getTotalTax('2020','02');

            totalJanuary.should.equal(210,9);
            totalFebruary.should.equal(416,5);
        })
    })

    async function createOrder(order:Order):Promise<Order>{
        let itens = order.itens;
        order = await OrderModel.create(<Order>{
            clientCode:2,
            date:moment().subtract(2,'days').toDate()
        });
        await OrderItemModel.create(itens.map(item=>({...item,orderCode:order.code})));
        return order;
    }
})