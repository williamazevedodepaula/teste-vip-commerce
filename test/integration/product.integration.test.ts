import { Product } from "../../entity/Product";
import * as supertest from 'supertest'
import * as chai from 'chai'
import { SetupTestDatabase, TestDatabaseResult } from "./test-database-setup";
const expect = chai.expect;
const should = chai.should();
const assert = chai.assert;

const app = require('../../server/server');
const ProductModel = app.models.Produto;
const OrderModel = app.models.Pedido;
const OrderItemModel = app.models.ItemPedido;

describe('Testes de Integração de Produtos',function(){

    let productList:Product[];
    let firstProduct:Product;
    let secondProduct:Product;

    before('Verifica se está no ambiente de teste, para evitar limpar o banco',function(){
        if(process.env.NODE_ENV != 'test'){
            throw Error("Testes de integração devem ser executados apenas em ambiente de TESTE, para evitar limpeza indesejada do banco de dados");
        }
    })
    
    before('Configura o banco de dados para testes',async function(){
        let testDb:TestDatabaseResult = await SetupTestDatabase(app);
        productList = testDb.products;
        firstProduct = testDb.products[0];
        secondProduct = testDb.products[1];
    })

    describe('Testes da camada de Repositorio',async function(){
        
    })

    describe('Testes de API',async function(){        
        
        it('Deve consultar um produto pela API',async function(){
            let result = await supertest(app).get(`/api/produtos/${firstProduct.code}`).expect(200);

            result.should.be.an('object').with.property('body').that.is.an('object');
            let product:Product = result.body;
            product.should.have.property('code').that.equals(firstProduct.code);
            product.should.have.property('name').that.equals(firstProduct.name);
            product.should.have.property('manufacturing').that.equals(firstProduct.manufacturing);
        })

        it('Deve consultar produtos pela API',async function(){
            let result = await supertest(app).get(`/api/produtos/`).expect(200);
            result.should.be.an('object').with.property('body').that.is.an('array').with.length(productList.length);
            let products:Product[] = result.body;

            products[0].should.have.property('code').that.equals(firstProduct.code);
            products[0].should.have.property('name').that.equals(firstProduct.name);
            products[0].should.have.property('manufacturing').that.equals(firstProduct.manufacturing);
            products[1].should.have.property('code').that.equals(secondProduct.code);
            products[1].should.have.property('name').that.equals(secondProduct.name);
            products[1].should.have.property('manufacturing').that.equals(secondProduct.manufacturing);
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

            result.should.be.an('object').with.property('body').that.is.an('object');
            let product:Product = result.body;
            
            product.should.be.an('object').with.property('code').that.equals(productList.length+1,'Deve ter sido gerado um codigo auto-incrementado para o produto');
            
            let check:Product = await ProductModel.findById(productList.length+1);
            check.should.be.an('object').that.have.property('code').that.equals(product.code,'O produto deve ter sido cadastrado no banco');
        })

        it('Deve realizar UPDATE em um produto pela API',async function(){
            let result = await supertest(app)
                .put(`/api/produtos/${firstProduct.code}`)
                .send(<Partial<Product>>{...firstProduct,price:200,code:undefined})
                .expect(200);
            
            let check:Product = await ProductModel.findById(firstProduct.code);
            check.should.be.an('object').that.have.property('price').that.equals(200,'O preço do produto deve ter sido alterado no banco');            
        })

        it('Não deve realizar EXCLUSÃO de um produto pela API caso haja pedido para o mesmo',async function(){
            let result = await supertest(app)
                .delete(`/api/produtos/${firstProduct.code}`)
                .expect(500);
        })

        it('Deve realizar EXCLUSÃO de um produto pela API caso NÃO haja pedido para o mesmo',async function(){
            await OrderItemModel.destroyAll({productCode:firstProduct.code});

            await supertest(app)
                .delete(`/api/produtos/${firstProduct.code}`)
                .expect(200);
            
            let check:Product = await ProductModel.findById(firstProduct.code);
            assert(!check,'O produto não deve mais existir no banco de dados');
        })
    })


})