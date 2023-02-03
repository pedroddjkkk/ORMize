# ORMize

ORMize is a TypeScript-developed Object-Relational Mapping (ORM), but can also be used in JavaScript. Its goal is to ease the interaction between applications and databases, allowing developers to work with data using objects instead of writing SQL code.

Currently, ORMize only supports the MySQL database, but I plan to add support for more databases in the future.

## Installation

To install ORMize, you can use npm:

```
npm install ormize
```

## How to use

To use ORMize, you need to set up the connection to the database and create your model classes.

### Setting up the connection

```javascript
import { Connection } from "ormize";

const connection = new Connection({
  host: "localhost",
  user: "root",
  port: 3306,
  database: "orm",
});

console.log(connection.isConnected());
```

### Creating model classes

```javascript
import { Model, Types } from "ormize";

class User extends Model {
  static tableName = "users";
  static fields = {
    id: { type: Types.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Types.STRING, allowNull: true },
    age: { type: Types.INTEGER, allowNull: true },
    email: { type: Types.STRING },
    password: { type: Types.STRING },
  };
  static connection = connection.getConnection();
}

//Synchronizing the model with the database
User.sync();
```

### Getting data

```javascript
//Getting all users
const users = await User.find();

//Getting a user by id
const user = await User.find({
  where: {
    id: 1,
  },
});

//Getting a user by email limiting by 1
const user = await User.find({
  where: {
    email: "Jhon@jhon.com",
  },
  limit: 1,
});
```

## Contributions

I am always looking for contributions to ORMize. If you find a bug or want to suggest a new feature, please open an issue on GitHub. If you want to contribute to the code, please send a pull request. Please, check the [CONTRIBUTING](CONTRIBUTING.MD) file for more information.

## Licença

ORMize is licensed under the MIT license. You can find the license in [LICENSE](LICENSE)
