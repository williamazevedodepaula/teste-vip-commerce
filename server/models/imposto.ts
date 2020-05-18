
import { Client } from "entity/Client";
import { Tax } from "../../entity/Tax";
import { Order } from "entity/Order";
import * as moment from 'moment';

const app = require('../../server/server');

module.exports = function(Imposto) {

    Imposto.getTotalTax = async function(clientCode:number, year:string, month:string):Promise<number>{
        const ClientModel = app.models.Cliente;
        const OrderModel = app.models.Pedido;

        let startDate = (moment(`${year}-${month}`).startOf('month')).toDate();
        let endDate   = (moment(`${year}-${month}`).endOf('month')).toDate();


        let client:Client = await ClientModel.findById(clientCode,{
            include:{
                relation:'orders',
                scope:{
                    include:[{
                        relation:'itens',
                        scope:{
                            include:['product']
                        }
                    }],
                    where:{
                        and:[
                            {date:{gte:startDate}},
                            {date:{lte:endDate}}
                        ]                        
                    }
                }
            }
        });
        
        return Tax.getClientTax((<any>client).toJSON());
    }
};
