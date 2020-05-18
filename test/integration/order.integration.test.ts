import {  } from "../../entity/Product";
import * as supertest from 'supertest'
import * as chai from 'chai';
import * as moment from 'moment';
import { SetupTestDatabase, TestDatabaseResult } from "./test-database-setup";
import {  Order } from "entity/Order";
import { OrderItem } from "entity/OrderItem";
const expect = chai.expect;
const should = chai.should();
const assert = chai.assert;

const app = require('../../server/server');
const OrderModel = app.models.Pedido;
const OrderItemModel = app.models.ItemPedido;
const ClientModel = app.models.Cliente;

describe('Testes de Integração de Pedidos',function(){

    before('Verifica se está no ambiente de teste, para evitar limpar o banco',function(){
        if(process.env.NODE_ENV != 'test'){
            throw Error("Testes de integração devem ser executados apenas em ambiente de TESTE, para evitar limpeza indesejada do banco de dados");
        }
    })

    let initialOrders:Order[];
    let firstOrder:Order;
    let secondOrder:Order;
    
    before('Configura o banco de dados para testes',async function(){
        let testDb:TestDatabaseResult = await SetupTestDatabase(app);
        initialOrders = testDb.orders;
        firstOrder = testDb.orders[0];
        secondOrder = testDb.orders[1];
    })

    describe('Testes da camada de Repositorio',async function(){
        it('Deve enviar email com dados do pedido',async function(){
            app.models.Pedido.should.have.property('sendByMail');

            if(process.env.EMAIL_FOR_RECEIVING_TEST){
                let persistent = await ClientModel.findById(secondOrder.code);
                await persistent.updateAttribute('email',process.env.EMAIL_FOR_RECEIVING_TEST);
            }

            await app.models.Pedido.sendByMail(secondOrder.code);
        })
    })

    describe('Testes de API',async function(){        
        
        it('Deve consultar um pedido pela API',async function(){
            let result = await supertest(app).get(`/api/pedidos/${firstOrder.code}`).expect(200);

            result.should.be.an('object').with.property('body').that.is.an('object');
            let order:Order = result.body;
            order.should.have.property('code').that.equals(firstOrder.code);
            order.should.have.property('clientCode').that.equals(firstOrder.clientCode);
            order.should.have.property('date');
            assert(moment(order.date).format('DD/MM/YY HH:mm') == moment(firstOrder.date).format('DD/MM/YY HH:mm'));
        })

        it('Deve consultar pedidos pela API',async function(){
            let result = await supertest(app).get(`/api/pedidos/`).expect(200);
            result.should.be.an('object').with.property('body').that.is.an('array').with.length(initialOrders.length);
            let orders:Order[] = result.body;

            orders[0].should.have.property('code').that.equals(firstOrder.code);
            orders[0].should.have.property('date');
            orders[0].should.have.property('clientCode').that.equals(firstOrder.clientCode);
            assert(moment(orders[0].date).format('DD/MM/YY HH:mm') == moment(firstOrder.date).format('DD/MM/YY HH:mm'));

            orders[1].should.have.property('code').that.equals(secondOrder.code);
            orders[1].should.have.property('date');
            orders[1].should.have.property('clientCode').that.equals(secondOrder.clientCode);
            assert(moment(orders[1].date).format('DD/MM/YY HH:mm') == moment(secondOrder.date).format('DD/MM/YY HH:mm'));
        })

        it('Deve cadastrar um pedido pela API',async function(){
            let result = await supertest(app)
                .post(`/api/pedidos`)
                .send(<Partial<Order>>{
                    clientCode:1,
                    itens:[
                        {
                            amount:10,
                            productCode:1
                        },
                        {
                            amount:4,
                            productCode:2
                        }
                    ]
                })
                .expect(200);

            result.should.be.an('object').with.property('body').that.is.an('object');
            let order:Order = result.body;
            
            order.should.be.an('object').with.property('code').that.equals(initialOrders.length+1,'Deve ter sido gerado um codigo auto-incrementado para o pedido');
            let orderDate = order.date;
            let currentDate = new Date();
            assert(moment(orderDate).isSame(currentDate,'minute'),'A data do pedido deve ser a data atual');

            let itens:OrderItem[] = await OrderItemModel.find({where:{orderCode:order.code}});
            itens.should.be.an('array').with.length(2);
            itens[0].should.be.an('object').that.have.property('amount').that.equals(10);
            itens[0].should.be.an('object').that.have.property('orderCode').that.equals(order.code);
            itens[0].should.be.an('object').that.have.property('productCode').that.equals(1);

            itens[1].should.be.an('object').that.have.property('amount').that.equals(4);
            itens[1].should.be.an('object').that.have.property('orderCode').that.equals(order.code);
            itens[1].should.be.an('object').that.have.property('productCode').that.equals(2);
            
            let check:Order = await OrderModel.findById(3);
            check.should.be.an('object').that.have.property('code').that.equals(3,'O pedido deve ter sido cadastrado no banco');
        })

        it('Deve realizar UPDATE em um pedido pela API',async function(){
            let newDateMoment = moment().add(2,'days');
            let result = await supertest(app)
                .put(`/api/pedidos/${firstOrder.code}`)
                .send(<Partial<Order>>{
                    ...firstOrder,
                    date:newDateMoment.toDate(),
                    code:undefined,
                    itens:[
                        {productCode:1,amount:4}
                    ]
                })
                .expect(200);
            
            let check:Order = await OrderModel.findById(firstOrder.code);

            check.should.be.an('object').that.have.property('date');
            let checkDateStr = moment(check.date).format('DD/MM/YYYY');
            let currentDate = newDateMoment.format('DD/MM/YYYY');
            assert(checkDateStr == currentDate,'A data do pedido deve ter sido alterada no banco');

            let itens:OrderItem[] = await OrderItemModel.find({where:{orderCode:firstOrder.code}});
            itens.should.be.an('array').with.length(1,'Os itens anteriores do pedido devem ter sido substituidos pelo novo');
            itens[0].should.be.an('object').that.have.property('amount').that.equals(4);
            itens[0].should.be.an('object').that.have.property('orderCode').that.equals(firstOrder.code);
            itens[0].should.be.an('object').that.have.property('productCode').that.equals(1);
        })

        it('Deve realizar EXCLUSÃO de um pedido pela API',async function(){
            await supertest(app)
                .delete(`/api/pedidos/${firstOrder.code}`)
                .expect(200);
            
            let check:Order = await OrderModel.findById(firstOrder.code);
            assert(!check,'O pedido não deve mais existir no banco de dados');

            let itens:OrderItem[] = await OrderItemModel.find({where:{orderCode:firstOrder.code}});
            itens.should.be.an('array').with.length(0,'Os itens do pedido devem ter sido excluidos tambem');
        })
    })


})