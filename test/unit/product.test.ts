'use strict'

import * as chai from 'chai';
import { Client } from '../../entity/Client'
import { Product } from '../../entity/Product';
const should = chai.should();
const expect = chai.expect;

describe('Testes de Produto',function(){

    it('Deve criar um Produto',async function(){
        let product:Product = new Product(undefined);
        expect(product).to.exist;
    })

    it('Deve criar um Produto à partir de um JSON',async function(){
        let product:Product = new Product({
            code:1,
            name:'Cortina Blackout',
            manufacturing:'imported',
            size:'2,8m x 2,3m',
            price:200.00
        });
        product.should.have.property('code').that.equals(1);
        product.should.have.property('name').that.equals('Cortina Blackout');
        product.should.have.property('manufacturing').that.equals('imported');
        product.should.have.property('size').that.equals('2,8m x 2,3m');
        product.should.have.property('price').that.equals(200);
    })
})