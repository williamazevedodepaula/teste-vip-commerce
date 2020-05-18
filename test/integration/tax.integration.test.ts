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
const ReportModel = app.models.relatorio;

describe('Testes de Integração de Impostos',function(){
    before('Verifica se está no ambiente de teste, para evitar limpar o banco',function(){
        if(process.env.NODE_ENV != 'test'){
            throw Error("Testes de integração devem ser executados apenas em ambiente de TESTE, para evitar limpeza indesejada do banco de dados");
        }
    })

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
        //Impostos: 45
        await createOrder(<any>{
            clientCode:1,
            date:moment('2020-01-12').toDate(),
            payment:'CASH',
            itens:[{amount:2,productCode:1},{amount:3,productCode:2}]
        });
        //Impostos: 30, 135
        await createOrder(<any>{
            clientCode:1,
            date:moment('2020-01-31').toDate(),
            payment:'CHECK',
            itens:[{amount:1,productCode:4},{amount:2,productCode:3}]
        });
        //Impostos: 0, 9
        //--------_TOTAL de impostos: 219

        await createOrder(<any>{
            clientCode:1,
            date:moment('2020-02-01').toDate(),
            payment:'CASH',
            itens:[{amount:1,productCode:2},{amount:2,productCode:4}]
            //Imposto: 45,  0
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
        //--------_TOTAL de impostos: 421,5
    })

    describe('Testes da camada de Repositorio',async function(){
        
        it('Deve existir um Modelo não-persistente para calculo de impostos',async function(){
            expect(ReportModel).not.to.be.undefined;
        })

        it('Deve calcular o total de impostos de um cliente em um mes',async function(){
            let totalJanuary  = await ReportModel.getTotalTax(1,'2020','01');
            let totalFebruary = await ReportModel.getTotalTax(1,'2020','02');

            totalJanuary.should.equal(219);
            totalFebruary.should.equal(421.5);
        })
    })


    describe('Testes da camada de API',async function(){
             
        it('Deve calcular o total de impostos de um cliente em um mes pela API',async function(){
            let totalJanuary  = await supertest(app).get(`/api/relatorios/impostos/ano/2020/mes/01/cliente/1`).expect(200);
            let totalFebruary  = await supertest(app).get(`/api/relatorios/impostos/ano/2020/mes/02/cliente/1`).expect(200);        

            totalJanuary.body.should.equal(219);
            totalFebruary.body.should.equal(421.5);
        })
    })

    async function createOrder(order:Order):Promise<Order>{
        let itens = order.itens;
        order = await OrderModel.create(<Order>{
            ...order,
            code:undefined,
            itens:undefined
        });
        await OrderItemModel.create(itens.map(item=>({...item,orderCode:order.code})));
        return order;
    }
})