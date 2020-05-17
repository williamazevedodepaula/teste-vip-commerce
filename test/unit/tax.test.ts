import { Product } from "../../entity/Product"
import { Tax } from "../../entity/Tax"

describe('Testes sobre Impostos',async function(){

    it('Produtos nacional com valor maior que R$100,00 devem ter taxa de imposto de 10%',async function(){
        let product:Partial<Product> = {
            code:1,
            manufacturing:'national',
            name:'Cortina',
            size:'2.8m x 2.3m',
            price:200           
        }
        let taxAmount:number = Tax.getProductTax(product);
        taxAmount.should.equal(20,'O imposto aplicado deve ser de 10%');

        product.price = 101.1;
        taxAmount = Tax.getProductTax(product);
        
        taxAmount.should.equal(10.11,'O imposto aplicado deve ser de 10%');
    })

    it('Produtos nacional com valor inferior ou igual a R$100,00 devem ter isenção de imposto.',async function(){
        throw Error("Not yet implemented");
    })

    it('Produtos importados devem ter imposto de 15%',async function(){
        throw Error("Not yet implemented");
    })
})