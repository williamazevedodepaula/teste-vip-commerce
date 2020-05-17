import { Product } from "../../entity/Product"
import { Tax } from "../../entity/Tax"
import { Order } from "../../entity/Order"
import { Client } from "../../entity/Client"

describe('Testes sobre Impostos',async function(){

    it('Produtos nacional com valor maior que R$100,00 devem ter taxa de imposto de 10%',function(){
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

    it('Produtos nacional com valor inferior ou igual a R$100,00 devem ter isenção de imposto.',function(){
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

    it('Produtos importados devem ter imposto de 15%',function(){
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

    it('Deve calcular imposto total do pedido',function(){
        let order:Order = new Order({
            code:1,
            clientCode:12,
            client:<any>{
                code:12,
                name:'will',
                cpf:'10994028679',
                email:'will@teste.com'
            },
            date:new Date(),
            observation:'teste',
            payment:'CARD',
            products:<any>[
                {
                    code:1,
                    name:'Cortina',
                    manufacturing:'national',
                    size:'2.3m x 2.8m',
                    price:200
                },
                {
                    code:2,
                    name:'Cadeira Escritório',
                    manufacturing:'imported',
                    size:'1m x 58xm x 54cm',
                    price:300
                },
                {
                    code:3,
                    name:'Jogo de canetas',
                    manufacturing:'national',
                    price:15
                },
                {
                    code:4,
                    name:'Porta lápis',
                    manufacturing:'imported',
                    size:'15 cm x 15cm x 15cm',
                    price:20
                }
            ]
        });

        let taxAmount:number = Tax.getOrderTax(order);
        taxAmount.should.equal(68,'O imposto do pedido deve ser o somatorio dos impostos sobre os produtos do pedido');
    })


    it('Deve calcular imposto total dos pedidos de um cliente',function(){
        let order1:Order = new Order({
            code:1,
            products:<any>[
                {
                    code:1,
                    name:'Cortina',
                    manufacturing:'national',
                    size:'2.3m x 2.8m',
                    price:200
                },
                {
                    code:2,
                    name:'Cadeira Escritório',
                    manufacturing:'imported',
                    size:'1m x 58xm x 54cm',
                    price:300
                }
            ]
        });
        let order2:Order = new Order({
            code:2,
            products:<any>[                
                {
                    code:3,
                    name:'Jogo de canetas',
                    manufacturing:'national',
                    price:15
                },
                {
                    code:4,
                    name:'Porta lápis',
                    manufacturing:'imported',
                    size:'15 cm x 15cm x 15cm',
                    price:20
                }
            ]
        });
        let order3:Order = new Order({
            code:2,
            products:<any>[                
                {
                    code:3,
                    name:'Jogo de canetas importado',
                    manufacturing:'imported',
                    price:20
                }
            ]
        });


        let client:Client = new Client({
            code:1,
            name:'john',
            orders:[order1,order2,order3]
        });

        let totalTax:number = Tax.getClientTax(client);
        totalTax.should.equal(71,'O imposto total pago pelo cliente deve ser igual ao somatorio dos impostos em seus pedidos');
    });
})