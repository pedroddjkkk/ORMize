import { DbConnection } from "../connection/Connection.js";

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

  public static sync(): void {
    try {
      this.connection.query(
        `CREATE TABLE IF NOT EXISTS ${this.tableName} (id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY (id))`
      );
      for (const field in this.fields) {
        const fieldConfig = this.fields[field];
        const type = fieldConfig.type;
        const autoIncrement = fieldConfig.autoIncrement ? "AUTO_INCREMENT" : "";
        const primaryKey = fieldConfig.primaryKey ? "PRIMARY KEY" : "";
        const allowNull = fieldConfig.allowNull ? "NULL" : "NOT NULL";
        this.connection.query(
          `ALTER TABLE ${this.tableName} ADD COLUMN IF NOT EXISTS ${field} ${type} ${autoIncrement} ${primaryKey} ${allowNull}`
        );
      }
    } catch (error) {
      console.log("Erro na sincronização: " + error);
    }
  }
}
