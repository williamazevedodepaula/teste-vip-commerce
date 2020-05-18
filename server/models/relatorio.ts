
import { Client } from "entity/Client";
import { Tax } from "../../entity/Tax";
import { Order } from "entity/Order";
import * as moment from 'moment';

const app = require('../../server/server');

module.exports = function(Relatorio) {

    Relatorio.getTotalTax = async function(clientCode:number, year:number, month:number):Promise<number>{
        const ClientModel = app.models.Cliente;
        const OrderModel = app.models.Pedido;

        let startDate = (moment().year(year).month(month-1).startOf('month')).toDate();
        let endDate   = (moment().year(year).month(month-1).endOf('month')).toDate();


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
    Relatorio.remoteMethod('getTotalTax',{
        description:'Gets the total amount of taxes paid by a client in an entire month',
        accepts:[
            {
                arg:'clientCode',
                type:'number',
                required:true
            },
            {
                arg:'year',
                type:'number',
                required:true
            },
            {
                arg:'month',
                type:'number',
                required:true
            }
        ],
        returns: {
            arg: 'data',
            type: 'number',
            root: true
        },
        http: { verb: 'get', path:'/impostos/ano/:year/mes/:month/cliente/:clientCode/' }
    })
};
