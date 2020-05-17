'use strict';

import { Order } from "entity/Order";

const app = require('../../server/server');

module.exports = function(Pedido) {

    Pedido.afterRemote('create',async function(ctx,instance:Order){        
        for(var item of (instance.itens||[])){
            item.orderCode = instance.code;
            await app.models.ItemPedido.create(item)
        }
    })
};
