import { Order } from "entity/Order";
import * as moment from "moment";
import { OrderItem } from "entity/OrderItem";

export class OrderService{

    static formatCpf(cpf:string):string{
        return `${cpf.slice(0,3)}.${cpf.slice(3,6)}.${cpf.slice(6,9)}-${cpf.slice(9,11)}`;
    }

    static formatOrderNumber(orderNumber:number):string{
        let strSize = Math.max(4,String(orderNumber).length);
        return ("0000"+orderNumber).slice(-strSize);
    } 

    static calculateItemTotal(item:OrderItem):number{
        return item.amount * (item.product?.price||0);
    }

    static calculateTotal(order:Order):number{
        return order.itens?.reduce((sum,item)=>(sum+this.calculateItemTotal(item)),0)||0;
    }

    static formatEmailBody(order:Order):string{   
        let itens = order.itens?.reduce((itemList,item:OrderItem)=>{
            return itemList+
                `
                <tr>
                    <td>${item.product.name}</td>
                    <td>${item.product.manufacturing == 'imported' ? "Importada" : "Nacional"}</td>
                    <td>${item.product.size}</td>
                    <td>R$ ${item.product.price.toFixed(2)}</td>
                    <td>${item.amount}</td>
                    <td>R$ ${this.calculateItemTotal(item).toFixed(2)}</td>
                </tr>`
        },'')||'';
        
        return `
        <body>        
            <p><b>nº Pedido:</b>  ${this.formatOrderNumber(order.code)}</p>
            <p><b>Data:</b> ${moment(order.date).format('DD/MM/YYYY HH:mm')}</p>
            <p><b>Cliente:</b> ${order.client.name}</p>
            <p><b>CPF:</b> ${this.formatCpf(order.client.cpf)}</p>
            <hr/>
            <h3>Itens:</h3>
            <table>
                <tr>
                    <th>Produto</th>
                    <th>Fabricação</th>
                    <th>Tamanho</th>
                    <th>Vlr. Unitario</th>
                    <th>Quantidade</th>
                    <th>Total</th>
                </tr>${itens}
            </table>
            <h3>Total: R$ ${this.calculateTotal(order).toFixed(2)}</h3>
        </body>
        `;
    }            
}