import {  } from "../../entity/Product";
import * as supertest from 'supertest'
import * as chai from 'chai'
import { SetupTestDatabase, TestDatabaseResult } from "./test-database-setup";
import { Client } from "entity/Client";
const expect = chai.expect;
const should = chai.should();
const assert = chai.assert;

const app = require('../../server/server');
const ClientModel = app.models.Cliente;

describe('Testes de Integração de Clientes',function(){

    let firstClient:Client;
    let secondClient:Client;
    
    before('Configura o banco de dados para testes',async function(){
        let testDb:TestDatabaseResult = await SetupTestDatabase(app);
        firstClient = testDb.clients[0];
        secondClient = testDb.clients[1];
    })

    describe('Testes da camada de Respositorio',async function(){
        
    })

    describe('Testes de API',async function(){        
        
        it('Deve consultar um cliente pela API',async function(){
            let result = await supertest(app).get(`/api/clientes/${firstClient.code}`).expect(200);

            result.should.be.an('object').with.property('body').that.is.an('object');
            let client:Client = result.body;
            client.should.have.property('code').that.equals(firstClient.code);
            client.should.have.property('name').that.equals(firstClient.name);
            client.should.have.property('cpf').that.equals(firstClient.cpf);
            client.should.have.property('email').that.equals(firstClient.email);
        })

        it('Deve consultar clientes pela API',async function(){
            let result = await supertest(app).get(`/api/clientes/`).expect(200);
            result.should.be.an('object').with.property('body').that.is.an('array').with.length(2);
            let clients:Client[] = result.body;

            clients[0].should.have.property('code').that.equals(firstClient.code);
            clients[0].should.have.property('name').that.equals(firstClient.name);
            clients[0].should.have.property('cpf').that.equals(firstClient.cpf);
            clients[0].should.have.property('email').that.equals(firstClient.email);

            clients[1].should.have.property('code').that.equals(secondClient.code);
            clients[1].should.have.property('name').that.equals(secondClient.name);
            clients[1].should.have.property('cpf').that.equals(secondClient.cpf);
            clients[1].should.have.property('email').that.equals(secondClient.email);
        })

        it('Deve cadastrar um cliente pela API',async function(){
            let result = await supertest(app)
                .post(`/api/clientes`)
                .send(<Partial<Client>>{
                    name:'Jonathan',
                    cpf:'98315014030',
                    email:'jonathan@teste.com',
                    gender:'M'
                })
                .expect(200);

            result.should.be.an('object').with.property('body').that.is.an('object');
            let client:Client = result.body;
            
            client.should.be.an('object').with.property('code').that.equals(3,'Deve ter sido gerado um codigo auto-incrementado para o cliente');
            
            let check:Client = await ClientModel.findById(3);
            check.should.be.an('object').that.have.property('code').that.equals(3,'O cliente deve ter sido cadastrado no banco');
        })

        it('Deve realizar UPDATE em um cliente pela API',async function(){
            let result = await supertest(app)
                .put(`/api/clientes/${firstClient.code}`)
                .send(<Partial<Client>>{...firstClient,email:'william.changed@teste.com',code:undefined})
                .expect(200);
            
            let check:Client = await ClientModel.findById(firstClient.code);
            check.should.be.an('object').that.have.property('email').that.equals('william.changed@teste.com','O email do cliente deve ter sido alterado no banco');            
        })

        it('Deve realizar EXCLUSÃO de um cliente pela API',async function(){
            await supertest(app)
                .delete(`/api/clientes/${firstClient.code}`)
                .expect(200);
            
            let check:Client = await ClientModel.findById(firstClient.code);
            assert(!check,'O cliente não deve mais existir no banco de dados');
        })
    })


})