import { Product } from "../../entity/Product"
import { Tax } from "../../entity/Tax"

describe('Testes sobre Impostos',async function(){

    it('Produtos nacional com valor maior que R$100,00 devem ter taxa de imposto de 10%',async function(){
        let product1:Partial<Product> = {
            code:1,
            manufacturing:'national',
            name:'Cortina',
            size:'2.8m x 2.3m',
            price:200           
        }
        let product2:Partial<Product> = {
            code:2,
            manufacturing:'national',
            name:'cadeira simples',
            size:'1m x 58xm x 54cm',
            price:100.01
        }
        let taxAmount1:number = Tax.getProductTax(product1);
        let taxAmount2:number = Tax.getProductTax(product2);

        taxAmount1.should.equal(20.00,'O imposto aplicado deve ser de 10%');
        taxAmount2.should.equal(10.00,'O imposto aplicado deve ser de 10% (com 2 casas decimais)');        
    })

    it('Produtos nacional com valor inferior ou igual a R$100,00 devem ter isenção de imposto.',async function(){
        let product1:Partial<Product> = {
            code:1,
            manufacturing:'national',
            name:'Cortina',
            size:'2.8m x 2.3m',
            price:100           
        }
        let product2:Partial<Product> = {
            code:2,
            manufacturing:'national',
            name:'adesivo',
            size:'1cm x 1cm',
            price:0.5
        }
        let taxAmount1:number = Tax.getProductTax(product1);
        let taxAmount2:number = Tax.getProductTax(product2);

        taxAmount1.should.equal(0,'O imposto aplicado deve ser de 0, pois o produto em questão é isento');
        taxAmount2.should.equal(0,'O imposto aplicado deve ser de 0, pois o produto em questão é isento'); 
    })

    it('Produtos importados devem ter imposto de 15%',async function(){
        let product1:Partial<Product> = {
            code:1,
            manufacturing:'imported',
            name:'Cortina',
            size:'2.8m x 2.3m',
            price:100           
        }
        let product2:Partial<Product> = {
            code:2,
            manufacturing:'imported',
            name:'adesivo',
            size:'1cm x 1cm',
            price:0.50
        }
        let product3:Partial<Product> = {
            code:3,
            manufacturing:'imported',
            name:'Cortina grande',
            size:'4m x 2.3m',
            price:200           
        }
        let taxAmount1:number = Tax.getProductTax(product1);
        let taxAmount2:number = Tax.getProductTax(product2);
        let taxAmount3:number = Tax.getProductTax(product3);

        taxAmount1.should.equal(15,'O imposto sobre produtos importados é de 15%');
        taxAmount2.should.equal(0.07,'O imposto sobre produtos importados é de 15% (com 2 casas decimais)');
        taxAmount3.should.equal(30,'O imposto sobre produtos importados é de 15%');
    })
})