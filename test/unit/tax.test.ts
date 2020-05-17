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

        taxAmount1.should.equal(20,'O imposto aplicado deve ser de 10%');
        taxAmount2.should.equal(10.001,'O imposto aplicado deve ser de 10%');        
    })

    it('Produtos nacional com valor inferior ou igual a R$100,00 devem ter isenção de imposto.',async function(){
        throw Error("Not yet implemented");
    })

    it('Produtos importados devem ter imposto de 15%',async function(){
        throw Error("Not yet implemented");
    })
})