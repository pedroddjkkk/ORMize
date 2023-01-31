import { RowDataPacket } from "mysql2";
import { DbConnection } from "../Connection/Connection.js";

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
export class Model {
  protected static connection: DbConnection;
  protected static fields: ModelFields;
  protected static tableName: string;

  public static get<T extends Model>(this: { new (): T }, id: string): T {
    return new this();
  }

  public static getAll<T extends Model>(this: { new (): T }): T[] {
    return [new this()];
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
