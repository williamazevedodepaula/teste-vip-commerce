'use strict'

import * as chai from 'chai';
import { Client } from '../../entity/Client'
const should = chai.should();
const expect = chai.expect;

describe('Testes de Cliente',function(){

    it('Deve criar um cliente',async function(){
        let client:Client = new Client(undefined);
        expect(client).to.exist;
    })

    it('Deve criar um cliente à partir de um JSON',async function(){
        let client= new Client({
            codigo:1,
            nome:'will',
            email:'will@teste.com',
            cpf:'10994028677',
            sexo:'M'
        });
        client.should.have.property('codigo').that.equals(1);
        client.should.have.property('nome').that.equals('will');
        client.should.have.property('email').that.equals('will@teste.com');
        client.should.have.property('cpf').that.equals('10994028677');
        client.should.have.property('sexo').that.equals('M');
    })
})