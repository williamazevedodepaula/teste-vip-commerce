'use strict'

import * as chai from 'chai';
import { Client } from '../../entity/Client'
import { Product } from '../../entity/Product';
import { Order } from '../../entity/Order';
const should = chai.should();
const expect = chai.expect;

describe('Testes de Pedido',function(){

    it('Deve criar um Pedido',async function(){
        let order:Order = new Order();
        expect(order).to.exist;
    })

    it('Deve criar um Pedido à partir de um JSON',async function(){
        let date = new Date();
        let order:Order = new Order({
            code:1,
            clientCode:12,
            client:<any>{
                code:12,
                name:'will',
                cpf:'10994028679',
                email:'will@teste.com'
            },
            date:date,
            observation:'teste',
            payment:'CARD',
            itens:<any>[
                {
                    amount:1,
                    productCode:1,
                    product:{
                        code:1,
                        name:'Cortina',
                        manufacturing:"national",
                        size:'2.3m x 2.8m'
                    }
                },
                {
                    amount:3,
                    productCode:2,
                    product: {
                        code:2,
                        name:'Cadeira Escritório',
                        manufacturing:"imported",
                        size:'1m x 58xm x 54cm'
                    }
                }
            ]
        });

        order.should.have.property('code').that.equals(1);
        order.should.have.property('clientCode').that.equals(12);
        order.should.have.property('client').that.is.an('object').with.property('code').that.equal(12);
        order.should.have.property('date').that.equals(date);
        order.should.have.property('observation').that.equals('teste');
        order.should.have.property('payment').that.equals('CARD');
        order.should.have.property('itens').that.is.an('array').with.length(2);
        order.itens[0].should.have.property('product').that.is.an('object').that.have.property('code').that.equals(1);
        order.itens[0].should.have.property('productCode').that.equals(1);
        order.itens[0].should.have.property('amount').that.equals(1);

        order.itens[1].should.have.property('product').that.is.an('object').that.have.property('code').that.equals(2);
        order.itens[1].should.have.property('productCode').that.equals(2);
        order.itens[1].should.have.property('amount').that.equals(3);
    })

    it('Deve formatar um corpo de email à partir de um pedido',async function(){
        let order:Order = new Order({
            code:1,
            clientCode:12,
            client:<any>{
                code:12,
                name:'william azevedo',
                cpf:'10994028679',
                email:'will@teste.com'
            },
            date:new Date(),
            observation:'teste',
            payment:'CARD',
            itens:<any>[
                {
                    amount:1,
                    productCode:1,
                    product:{
                        code:1,
                        name:'Cortina',
                        manufacturing:"national",
                        size:'2.3m x 2.8m'
                    }
                },
                {
                    amount:3,
                    productCode:2,
                    product: {
                        code:2,
                        name:'Cadeira Escritório',
                        manufacturing:"imported",
                        size:'1m x 58xm x 54cm'
                    }
                }
            ]
        });

        let mailBody = order.formatEmailBody();

        mailBody.should.be.a('string').that.equals(`
        <body>        
            <p>Pedido nº 1</p>
            <p>Cliente: william azevedo</p>
            <p>CPF: 10994028679</p>
            <p>CPF: 10994028679</p>
        </body>
        `)
    })
})