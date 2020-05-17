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
        let client:Client = new Client({
            code:1,
            name:'will',
            email:'will@teste.com',
            cpf:'10994028677',
            gender:'M'
        });
        client.should.have.property('code').that.equals(1);
        client.should.have.property('name').that.equals('will');
        client.should.have.property('email').that.equals('will@teste.com');
        client.should.have.property('cpf').that.equals('10994028677');
        client.should.have.property('gender').that.equals('M');
    })
})