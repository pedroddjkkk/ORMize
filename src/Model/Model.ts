import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import { Connection, DbConnection } from "../Connection/Connection.js";

export interface ModelFields {
  [key: string]: {
    type: string;
    autoIncrement?: boolean;
    primaryKey?: boolean;
    allowNull?: boolean;
  };
}

export interface ColumnsFields {
  Default: Object;
  Extra: string;
  Field: string;
  Key: string;
  Null: string;
  Type: string;
}

export interface SelectArguments {
  where?: object;
  limit?: number;
}
export class Model {
  protected static connection: DbConnection;
  protected static fields: ModelFields;
  protected static tableName: string;

  public static get<T extends Model>(this: { new (): T }, id: string): T {
    return new this();
  }

  public static find(
    selectArguments: SelectArguments = {}
  ): Promise<
    [
      (
        | RowDataPacket[]
        | RowDataPacket[][]
        | OkPacket
        | OkPacket[]
        | ResultSetHeader
      ),
      FieldPacket[]
    ]
  > {
    return new Promise(async (resolve, reject) => {
      const { where = {}, limit } = selectArguments;
      let whereClause = "";
      if (Object.keys(where).length > 0) {
        whereClause =
          "WHERE " +
          Object.entries(where)
            .map(([key, value]) => `${key} = '${value}'`)
            .join(" AND ");
      }
      const limitClause = limit ? "LIMIT " + limit : "";
      const result = await this.connection.query(
        `SELECT * FROM ${this.tableName} ${whereClause} ${limitClause}`
      );
      resolve(result);
    });
  }

  public async save(): Promise<Object> {
    try {
      const fields = Object.keys(Model.fields);
      const values = fields.map((field) => this[field]);
      const result = await this.connection.query(
        `INSERT INTO ${this.tableName} (${fields.join(",")}) VALUES (${values
          .map((value) => `'${value}'`)
          .join(",")})`
      );
      return { message: "Registro salvo com sucesso", status: 200 };
    } catch (error) {
      console.log("Erro ao salvar registro: " + error);

      return { message: "Erro ao salvar registro", status: 500 };
    }
  }

  public static setup(
    fields: ModelFields,
    connection: DbConnection,
    tableName: string
  ): void {
    this.fields = fields;
    this.connection = connection;
    this.tableName = tableName;
  }

  public static async sync(): Promise<Object> {
    try {
      await this.connection.query(
        `CREATE TABLE IF NOT EXISTS ${this.tableName} (id INTEGER(6) AUTO_INCREMENT PRIMARY KEY)`
      );
      let columns: Array<Array<ColumnsFields>> | RowDataPacket =
        await this.connection.query(`SHOW COLUMNS FROM ${this.tableName}`);
      let rcolumns: Array<ColumnsFields> = columns[0];
      for (const field in this.fields) {
        const fieldConfig = this.fields[field];
        let exists = false;
        for (let i = 0; i < rcolumns.length; i++) {
          const column = rcolumns[i];
          if (!(column.Field in this.fields)) {
            await this.connection.query(
              `ALTER TABLE ${this.tableName} DROP COLUMN ${column.Field}`
            );
          }
          if (column.Field === field) {
            exists = true;
            if (
              column.Type !== fieldConfig.type ||
              column.Null !== (fieldConfig.allowNull ? "YES" : "NO")
            ) {
              await this.connection.query(
                `ALTER TABLE ${this.tableName} MODIFY COLUMN ${field} ${
                  fieldConfig.type
                } ${fieldConfig.allowNull ? "NULL" : "NOT NULL"}`
              );
            }
            if (
              column.Extra !==
              (fieldConfig.autoIncrement ? "auto_increment" : "")
            ) {
              await this.connection.query(
                `ALTER TABLE ${this.tableName} MODIFY COLUMN ${field} ${
                  fieldConfig.type
                } ${fieldConfig.allowNull ? "NULL" : "NOT NULL"} ${
                  fieldConfig.autoIncrement ? "AUTO_INCREMENT" : ""
                }`
              );
            }
            break;
          }
        }
        if (!exists) {
          const autoIncrement = fieldConfig.autoIncrement
            ? "AUTO_INCREMENT"
            : "";
          const primaryKey = fieldConfig.primaryKey ? "PRIMARY KEY" : "";
          const allowNull = fieldConfig.allowNull ? "NULL" : "NOT NULL";
          await this.connection.query(
            `ALTER TABLE ${this.tableName} ADD COLUMN ${field} ${fieldConfig.type} ${autoIncrement} ${primaryKey} ${allowNull}`
          );
        }
      }
      return { message: "Sincronização realizada com sucesso", status: 200 };
    } catch (error) {
      console.log("Erro na sincronização: " + error);
      return { message: "Erro na sincronização", status: 500 };
    }
  }
}
