import { Product } from "../../entity/Product";
import * as supertest from 'supertest'
import * as chai from 'chai'
const expect = chai.expect

const app = require('../../server/server');
const ProductModel = app.models.Product;

describe('Testes de Integração de Produtos',function(){

    let firstProduct:Product;
    let secondProduct:Product;

    before('Limpa os dados do banco',async function(){
        await ProductModel.destroyAll();
    })
    before('Cria um produto inicial no banco',async function(){
        firstProduct = await ProductModel.create(<Partial<Product>>{
            name:'Cortina preta nacional',
            manufacturing:'national',
            size:'2.8m x 2.3m',
            price:150.00            
        });
        firstProduct.should.have.property('code').that.equals(1);

        secondProduct = await ProductModel.create(<Partial<Product>>{
            name:'Cortina preta nacional',
            manufacturing:'imported',
            size:'2.8m x 2.3m',
            price:300.00            
        });
        secondProduct.should.have.property('code').that.equals(2);
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
            let result = await supertest(app).get(`/api/produtos/`).expect(200);
            result.should.be.an('array').with.length(2);

            result[0].should.be.an('object').that.have.property('code').that.equals(firstProduct.code);
            result[0].should.be.an('name').that.have.property('code').that.equals(firstProduct.name);
            result[0].should.be.an('manufacturing').that.have.property('code').that.equals(firstProduct.manufacturing);
            result[1].should.be.an('object').that.have.property('code').that.equals(firstProduct.code);
            result[1].should.be.an('name').that.have.property('code').that.equals(firstProduct.name);
            result[1].should.be.an('manufacturing').that.have.property('code').that.equals(firstProduct.manufacturing);
        })

        it('Deve cadastrar um produto pela API',async function(){
            let result = await supertest(app)
                .post(`/api/produtos`)
                .send(<Partial<Product>>{
                    name:'Porta lápis',
                    size:'10cm x 10cm x 10cm',
                    price:20,
                    manufacturing:'national'
                })
                .expect(200);
            
            result.should.be.an('object').with.property('code').that.equals(3,'Deve ter sido gerado um codigo auto-incrementado para o produto');
            
            let check:Product = await ProductModel.findById(3);
            check.should.be.an('object').that.have.property('code').that.equals(3,'O produto deve ter sido cadastrado no banco');
        })

        it('Deve realizar UPDATE em um produto pela API',async function(){
            let result = await supertest(app)
                .put(`/api/produtos/${firstProduct.code}`)
                .send(<Partial<Product>>{                    
                    price:200
                })
                .expect(200);
            
            let check:Product = await ProductModel.findById(firstProduct.code);
            check.should.be.an('object').that.have.property('price').that.equals(200,'O preço do produto deve ter sido alterado no banco');            
        })

        it('Deve realizar EXCLUSÃO de um produto pela API',async function(){
            let result = await supertest(app)
                .delete(`/api/produtos/${firstProduct.code}`)
                .expect(200);
            
            let check:Product = await ProductModel.findById(firstProduct.code);
            expect(check).to.be(undefined);
        })
    })


})