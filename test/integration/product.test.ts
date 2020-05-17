import { Product } from "../../entity/Product";
import * as supertest from 'supertest'
import { PersistedModel } from "loopback";

const app = require('../../server/server');
const ProductModel = app.models.Product;

describe('Testes de Integração de Produtos',function(){

    let firstProduct:Product;

    before('Limpa os dados do banco',async function(){
        await ProductModel.destroyAll();
    })
    before('Cria um produto inicial no banco',async function(){
        firstProduct = await ProductModel.create(<Partial<Product>>{
            name:'Cortina preta nacional',
            manufacturing:'national',
            price:150.00            
        });
        firstProduct.should.have.property('code').that.equals(1);
    })

    describe('Testes da camada de Moelo/Serviço',async function(){
        
    })

    describe('Testes de API',async function(){        
        
        it('Deve consultar um produto pela API',async function(){
            let result = await supertest(app).get(`/api/produtos/${firstProduct.code}`).expect(200);
            result.should.be.an('object').that.have.property('code').that.equals(firstProduct.code);
            result.should.be.an('name').that.have.property('code').that.equals(firstProduct.name);
            result.should.be.an('manufacturing').that.have.property('code').that.equals(firstProduct.manufacturing);
        })

        it('Deve consultar produtos pela API',async function(){
            let result = await supertest(app).get(`/api/produtos/${firstProduct.code}`).expect(200);
            result.should.be.an('object').that.have.property('code').that.equals(firstProduct.code);
            result.should.be.an('name').that.have.property('code').that.equals(firstProduct.name);
            result.should.be.an('manufacturing').that.have.property('code').that.equals(firstProduct.manufacturing);
        })
    })


})