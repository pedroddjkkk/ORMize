import { DbConnection } from "../Connection/Connection.js";

interface ModelFields {
  [key: string]: {
    type: string;
    autoIncrement?: boolean;
    primaryKey?: boolean;
    allowNull?: boolean;
  };
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
      const columns: any = await this.connection.query(
        `SHOW COLUMNS FROM ${this.tableName}`
      );
      for (const field in this.fields) {
        columns[0].forEach((column: any) => {
          if (column.Field === field) {
              delete this.fields[field];
          }
        });
      }
      for (const field in this.fields) {
        const fieldConfig = this.fields[field];
        const type = fieldConfig.type;
        const autoIncrement = fieldConfig.autoIncrement ? "AUTO_INCREMENT" : "";
        const primaryKey = fieldConfig.primaryKey ? "PRIMARY KEY" : "";
        const allowNull = fieldConfig.allowNull ? "NULL" : "NOT NULL";
        await this.connection.query(
          `ALTER TABLE ${this.tableName} ADD COLUMN ${field} ${type} ${autoIncrement} ${primaryKey} ${allowNull}`
        );
      }
      return { message: "Sincronização realizada com sucesso", status: 200 };
    } catch (error) {
      console.log("Erro na sincronização: " + error);
      return { message: "Erro na sincronização", status: 500 };
    }
  }
}
