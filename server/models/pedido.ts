'use strict';

import { Order } from "entity/Order";
import { OrderService } from "../../logic/OrderService";

const app = require('../../server/server');

module.exports = function(Pedido) {


    Pedido.registerOrder = async function(order:Order):Promise<Order>{
        let itens = order.itens||[];
        let persistedItens = [];
        order = await Pedido.create(order);
        for(var item of itens){
            item.orderCode = order.code;
            item = await app.models.ItemPedido.create(item)
            persistedItens.push(item);
        }
        return <any>{...order,itens:persistedItens};
    }
    Pedido.remoteMethod('registerOrder',{
        description:'Creates an order and its itens in the datasource',
        accepts:[
            {
                arg:'order',
                type:'novoPedido',
                http:{
                    source:'body'
                }
            }
        ],
        returns: {
            arg: 'data',
            type: 'pedido',
            root: true
        },
        http: { verb: 'post', path:'/' }
    })



    Pedido.updateOrder = async function(id:number,dataToUpdate:Order):Promise<Order>{
        let order:Order = await Pedido.findById(id);

        let itens = dataToUpdate.itens;
        let persistedItens = [];

        order = await order.updateAttributes({date:dataToUpdate.date});

        if(dataToUpdate.itens){
            await app.models.ItemPedido.destroyAll({orderCode:id});
            for(var item of itens){
                item.orderCode = order.code;
                item = await app.models.ItemPedido.create(item)
                persistedItens.push(item);
            }
        }
        return <any>{...order,itens:persistedItens};
    }
    Pedido.remoteMethod('updateOrder',{
        description:'Updates an order and replace its itens in the datasource',
        notes:['if "itens" is not informed, the itens in the order will not be replaced nor deleted'],
        accepts:[
            {
                arg:'id',
                type:'number',
                required:true
            },
            {
                arg:'order',
                type:'novoPedido',
                http:{
                    source:'body'
                }
            }
        ],
        returns: {
            arg: 'data',
            type: 'pedido',
            root: true
        },
        http: { verb: 'put', path:'/:id' }
    })


    Pedido.sendByMail = async function(id:number):Promise<any>{
        let order:Order = await app.models.Pedido.findById(id,{
            include:[{
                relation:'itens',
                scope:{
                    include:['product']
                }
            },{
                relation:'client'
            }]
        });
        if(!order){
            let e = new Error("Pedido inválido");
            (<any>e).status = 404;
            throw e;
        }
        order = (<any>order).toJSON();

        let mailBody = OrderService.formatEmailBody(order);

        await new Promise((resolve,reject)=>{
            app.models.Email.send({
                to: [order.client?.email],
                from: `teste.vip.commerce@gmail.com`,
                subject: `Pedido Nº ${OrderService.formatOrderNumber(id)}`,
                text: 'Seguem os detalhes de seu pedido',
                html: mailBody
              }, function(err, mail) {

                if(err) reject(err);
                resolve();
              })
        })

        return mailBody;
    }
    Pedido.remoteMethod('sendByMail',{
        description:'Sends the detailed order data by email to the Client',
        accepts:[
            {
                arg:'id',
                description:'The order number',
                type:'number',
                required:true
            }
        ],
        returns: {
            arg: 'data',
            type: 'string',
            root: true
        },
        http: { verb: 'post', path:'/:id/sendmail' }
    })

};
