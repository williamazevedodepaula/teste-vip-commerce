'use strict'

import * as chai from 'chai';
import { Client } from '../../entity/Client'
import { Produto } from '../../entity/Produto';
const should = chai.should();
const expect = chai.expect;

describe('Testes de Produto',function(){

    it('Deve criar um Produto',async function(){
        let produto:Produto = new Produto(undefined);
        expect(produto).to.exist;
    })

    it('Deve criar um Produto à partir de um JSON',async function(){
        let client= new Produto({
            codigo:1,
            nome:'Cortina Blackout',
            fabricacao:'nacional',
            tamanho:'2,8m x 2,3m',
            valor:200.00
        });
        client.should.have.property('codigo').that.equals(1);
        client.should.have.property('nome').that.equals('Cortina Blackout');
        client.should.have.property('fabricacao').that.equals('nacional');
        client.should.have.property('tamanho').that.equals('2,8m x 2,3m');
        client.should.have.property('valor').that.equals(200);
    })
})