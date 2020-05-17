import {  } from "../../entity/Product";
import * as supertest from 'supertest'
import * as chai from 'chai';
import * as moment from 'moment';
import { SetupTestDatabase, TestDatabaseResult } from "./test-database-setup";
import {  Order } from "entity/Order";
const expect = chai.expect;
const should = chai.should();
const assert = chai.assert;

const app = require('../../server/server');
const OrderModel = app.models.Ordere;

describe('Testes de Integração de Pedidos',function(){

    let firstOrder:Order;
    let secondOrder:Order;
    
    before('Configura o banco de dados para testes',async function(){
        let testDb:TestDatabaseResult = await SetupTestDatabase(app);
        firstOrder = testDb.orders[0];
        secondOrder = testDb.orders[1];
    })

    describe('Testes da camada de Moelo/Serviço',async function(){
        
    })

    describe('Testes de API',async function(){        
        
        it('Deve consultar um pedido pela API',async function(){
            let result = await supertest(app).get(`/api/pedidos/${firstOrder.code}`).expect(200);

            result.should.be.an('object').with.property('body').that.is.an('object');
            let order:Order = result.body;
            order.should.have.property('code').that.equals(firstOrder.code);
            order.should.have.property('clientCode').that.equals(firstOrder.clientCode);
            order.should.have.property('date').that.equals(firstOrder.date);
        })

        it('Deve consultar pedidos pela API',async function(){
            let result = await supertest(app).get(`/api/pedidos/`).expect(200);
            result.should.be.an('object').with.property('body').that.is.an('array').with.length(2);
            let orders:Order[] = result.body;

            orders[0].should.have.property('code').that.equals(firstOrder.code);
            orders[0].should.have.property('date').that.equals(firstOrder.date);
            orders[0].should.have.property('clientCode').that.equals(firstOrder.clientCode);

            orders[1].should.have.property('code').that.equals(firstOrder.code);
            orders[1].should.have.property('date').that.equals(firstOrder.date);
            orders[1].should.have.property('clientCode').that.equals(firstOrder.clientCode);
        })

        it('Deve cadastrar um pedido pela API',async function(){
            let result = await supertest(app)
                .post(`/api/pedidos`)
                .send(<Partial<Order>>{
                    clientCode:1
                })
                .expect(200);

            result.should.be.an('object').with.property('body').that.is.an('object');
            let order:Order = result.body;
            
            order.should.be.an('object').with.property('code').that.equals(3,'Deve ter sido gerado um codigo auto-incrementado para o pedido');
            let orderDate = order.date;
            let currentDate = new Date();
            assert(moment(orderDate).isSame(currentDate,'minute'),'A data do pedido deve ser a data atual');
            
            let check:Order = await OrderModel.findById(3);
            check.should.be.an('object').that.have.property('code').that.equals(3,'O pedido deve ter sido cadastrado no banco');
        })

        it('Deve realizar UPDATE em um pedido pela API',async function(){
            let newDate = moment().add(2,'days').toDate();
            let result = await supertest(app)
                .put(`/api/pedidos/${firstOrder.code}`)
                .send(<Partial<Order>>{...firstOrder,date:newDate,code:undefined})
                .expect(200);
            
            let check:Order = await OrderModel.findById(firstOrder.code);
            check.should.be.an('object').that.have.property('date').that.equals(newDate,'O email do pedido deve ter sido alterado no banco');            
        })

        it('Deve realizar EXCLUSÃO de um pedido pela API',async function(){
            await supertest(app)
                .delete(`/api/pedidos/${firstOrder.code}`)
                .expect(200);
            
            let check:Order = await OrderModel.findById(firstOrder.code);
            assert(!check,'O pedido não deve mais existir no banco de dados');
        })
    })


})