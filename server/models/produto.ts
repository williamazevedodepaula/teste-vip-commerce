'use strict';

import { Product } from "entity/Product";

/**
 * Extende o modelo Produto do loopback, acrescentando novos métodos
 */
module.exports = function(Produto) {

    /**
     * Validação do campo 'manufacturing'. Impede que valores invalidos sejam informados pela API
     */
    Produto.validate("manufacturing",function(err) {
        if (!['imported','national'].includes((<Product>this).manufacturing)){
            err();
        }
    },{message:'invalid manufacturing value. Accepted values: "imported","national" ' });    
};
