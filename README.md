# teste-vip-commerce
Prova de desenvolvimento: API de pedidos.

A API foi desenvolvida utilizando as ferramentas Node, Loopback 3 e a linguagem TypeScript (através do módulo ts-node).

A execução do projeto ocorre através do *docker-compose*, que contém a descrição de 2 serviços executados através de containers do docker:

* database: Uma instância de banco de dados MySql
* api: A API desenvolvida



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

3. Para consultar os logs:

Log do banco da API:

```
  docker-compose logs -f api
```

Log do banco de dados:

```
  docker-compose logs -f database
```

4. Após inicializada (a primeira vez demora um pouco, devido ao **build** das imagens e instalação das dependências), a api estará disponível em:

http://localhost:3000/api

e a **DOCUMENTAÇÂO** completa da API, utilizando a interface *swagger*, bem como interface gráfica para interação com a API estarão disponíveis em:

http://localhost:3000/explorer/

## Testes Automatizados

Os testes automatizados foram divididos em dois grupos: **Testes Unitários** e **Testes de Integração**.

Os testes unitários são independentes de banco de dados e do framework, e podem ser executados sem que a aplicação esteja executando:

```
npm run unit-test
```

Os Testes de integração, por sua vez, dependem do Framework e do banco de dados, e por isso precisam ser executados DENTRO DO CONTAINER DO DOCKER. Alem disso, por segurança, é necessário que esteja executando em ambiente de **TESTE**. Se executar o comando para teste de integração em ambiente de **DESENVOLVIMENTO**, os testes irão falhar com uma mensagem de alerta no console.
Para executar o teste de integração, dentro do container:

```
docker exec -it api npm run integration-test
```

Para executar todos os testes (dentro do container):

```
docker exec -it api npm test
```

### Recebimento de emails

Alguns testes de integração envolvem o envio de email para Cliente, com os dados do pedido. Para que você possa receber esses emails em sua caixa de entrada, é necessário alterar uma variável de ambiente no **docker-compose.test.override.yml**. Abra o arquivo e localize a seguinte variável de ambiente na secção **environment**, e altere para o email de sua preferência:

```
EMAIL_FOR_RECEIVING_TEST=meu.email@exemplo.com
```

Em seguida, reinicie a api e execute os testes novamente:

```
docker-compose -f docker-compose.yml -f docker-compose.development.override.yml restart api
docker exec -it api npm test
```

Ao fazer isso, o email do Cliente no banco de dados de teste será cadastrado com o email fornecido para a variável de ambiente, e você receberá o email enviado durante o teste em sua caixa de entrada.


## Organização do código-fonte

A seguir está a descrição dos principais diretórios e arquivos da aplicação

### Raiz

Dentre os vários arquivos de configuração na raiz do projeto, podemos destacar:

* Dockerfile: Arquivo com diretrizes para construcao da imagem do docker à partir do codigo fonte
* docker-compose.yml: Arquivo docker-compose base, contendo a descrição dos serviços
* docker-compose.test.override.yml: Arquivo docker-compose override para ambiente de teste
* docker-compose.test.development.yml: Arquivo docker-compose override para ambiente de desenvolvimento

### docker

Diretório que contém arquivos utilizados durante o build da imagem do docker. Dentro deste diretório é montado o **volume** com os dados do banco de dados durante a execução da aplicação, em **docker/volumes**.

* Entrypont: entrypoint da imagem do docker
* wait-for-it: script utilizado para que a api espere a correta inicializacao do banco de dados antes de iniciar o loopback

### Entity

Neste diretório estão as classes que definem as entidades utilizadas na aplicação

* BaseEntity: Entidade base, da qual todas herdam
* Client: Classe que representa o cliente
* Order: Classe que representa um pedido
* OrderItem: Classe que representa um item de pedido
* Product: Classe que representa um produto

### Server

Neste diretório estão os arquivos necessários à execução do loopback, e os modelos do mesmo, que refletem a estrutura das tambelas do banco de dados em um modelo ORM. Além disso, os modelos do loopback fornecem uma camada de "repositório" para a aplicação. Na definicação dos modelos, os endpoints da API são vinclulados a métodos dessa camada. Cada modelo possui um arquivo .json, com a definição do modelo, e um arquivo .ts, com implementação de métodos e definições de endpoints.

* **cliente**: Modelo referente á tabela cliente no banco de dados
* **email**: Modelo não-persistente utilizado para disparar envio de emails
* **item-pedido**: Modelo privado (não exposto via API) para acesso à tabela de itens de pedido
* **novoPedido**: Modelo não persistente utilizado para descrever o esquema de dados a serem enviados para os endpoints PUT e POST pedidos.
* **pedido**: Modelo referente à tabela Pedido no banco de dados
* **produto**: Modelo referente à tabela produto no banco de dados
* **relatorio**: Modelo não persistente que provê os métodos de acesso a relatórios

### Service

O Loopback é um framework que mescla a camada de representação do modelo com a camada de repositório, o que gera várias facilidades por um lado, mas dificulta a realização de testes de UNIDADE, devido à dependencia com as estruturas do framework. Por esse motivo, para facilitar a criação de testes UNITÀRIOS que executam de forma independente do framework e do datasource, foi criada esta "camada" na aplicação para execução de lógicas "puras", dependentes apenas das definições das entidades.

* **OrderService**: Provém vários métodos de serviço relacionados a pedido: Totalização, totalização por item, formatação de núemros e máscaras, e composição do corpo do email.
* **TaxService**: Provém métodos para cálculos de impostos

### Test

Contém dois subdiretórios: **integration** e **unit**, contendo os testes de integração e unitários, respectivamente. Todos os testes foram escritos utilizando **mocha** e **chai**.

* **integration/client-integration.test.ts**: Testes de integração referentes à API de clientes e a métodos de repositório
* **integration/order-integration.test.ts**: Testes de integração referentes à API de pedidos e a métodos de repositório
* **integration/product-integration.test.ts**: Testes de integração referentes à API de produtos e a métodos de repositório * **integration/report-integration.test.ts**: Testes de integração referentes à API de relatórios e a métodos de repositório

* **unit/client-test.ts**: Testes unitŕios referentes a CLientes
* **unit/order-test.ts**: Testes unitŕios referentes a Pedidos
* **unit/product-test.ts**: Testes unitŕios referentes a Produtos
* **unit/product-test.ts**: Testes unitŕios referentes a Calculo de impostos
