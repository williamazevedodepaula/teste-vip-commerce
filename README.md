# teste-vip-commerce
Prova de desenvolvimento: API de pedidos

## Instalação/Execução

### Pré-Requisitos: 

Os seguintes softwares são necessários para a correta execução:

* Docker
* Docker-compose

### Procedimento de execução

1. Clonar o repositorio
2. Executar o projeto usando um dos ambientes: **TESTE** ou **DESENVOLVIMENTO**. O ambiente de **TESTE** deve ser utilizado para execução dos testes de integração, e possui um banco de dados que será modificado a cada execução de teste. **Não é possível** executar testes de integração no ambiente de **DESENVOLVIMENTO**, para evitar exclusão e recriação indesejada do banco de dados.

Para executar a aplicação em ambiente de **TESTE**, na raiz do projeto, executar:

```
  docker-compose -f docker-compose.yml -f docker-compose.test.override.yml up -d
```
Para executar a aplicação em ambiente de **DESENVOLVIMENTO**, na raiz do projeto, executar:

```
  docker-compose -f docker-compose.yml -f docker-compose.development.override.yml up -d
```

Para parar a aplicação:

```
  docker-compose -f docker-compose.yml -f docker-compose.development.override.yml down
```

**IMPORTANTE**: Para executar a aplicação em outro ambiente, primeiro parar a aplicação e depois reexecutar no ambiente desejado
