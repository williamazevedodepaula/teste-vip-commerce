'use strict';

import { Order } from "entity/Order";

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
};
