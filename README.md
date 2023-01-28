# ORMize
ORMize é um ORM (Object-Relational Mapping) desenvolvido em TypeScript, mas também pode ser utilizado em JavaScript. Ele tem como objetivo facilitar a interação entre aplicações e bancos de dados, permitindo que os desenvolvedores possam trabalhar com os dados utilizando objetos em vez de escrever código SQL.

Atualmente, ORMize suporta apenas o banco de dados MySQL, mas planejo adicionar suporte a mais bancos de dados no futuro.

## Instalação
Para instalar o ORMize, você pode utilizar o npm:
```
npm install ormize
```

## Como usar
Para utilizar o ORMize, você precisa configurar a conexão com o banco de dados e criar suas classes de modelo.

### Configurando a conexão
```javascript
import { Connection } from 'ormize';

const connection = new Connection();

async function test() {
  await connection.connect("127.0.0.1", "root", 3306, "database");
  console.log(connection.isConnected());
}

test();
```
## Contribuições
Estou sempre procurando por contribuições para o ORMize. Se você encontrar algum bug ou quiser sugerir uma nova funcionalidade, por favor abra uma issue no GitHub. Se você quiser contribuir com o código, por favor envie um pull request.

## Licença
ORMize está licenciado sob a licença MIT. Pode encontrar a liscença em [LICENSE](LICENSE)
