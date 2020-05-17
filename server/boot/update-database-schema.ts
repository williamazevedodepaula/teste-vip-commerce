'use strict';

/**
 * Aplica atualizações na estrutura do banco de dados, com base na definição dos modelos
 */
module.exports = function(server) {  
  if(process.env.NODE_ENV != 'test'){
    server.dataSources.db.autoupdate();
  }  
};
