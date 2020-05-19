'use strict';

import { Client } from "entity/Client";

/**
 * Extende o modelo Cliente do loopback, acrescentando novos métodos
 */
module.exports = function(Cliente) {

    /**
     * Validação do campo 'gender'. Impede que valores invalidos sejam informados pela API
     */
    Cliente.validate("gender",function(err) {
        if (!['M','F',undefined].includes((<Client>this).gender)){
            err();
        }
    },{message:'invalid gender value. Accepted values: "M","F", and undefined ' }); 
    
    /**
     * Validação do tamanho do CPF. Deve ter 11 digitos (sem mascara)
     */
    Cliente.validatesLengthOf('cpf', {is: 11,message:{is:'CPF should have 11 digits (with no mask)'}});
};
