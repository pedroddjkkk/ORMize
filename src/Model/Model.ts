import { DbConnection } from "../connection/Connection.js";

export class Model {
  protected static connection: DbConnection;
  protected static fields: Object;
  protected static tableName: string;

  public static get<T extends Model>(this: { new (): T }, id: string): T {
    return new this();
  }

  public static getAll<T extends Model>(this: { new (): T }): T[] {
    return [new this()];
  }

  public static setup<T extends Model>(
    this: { new (): T },
    fields: any,
    connection: DbConnection
  ): T {
    return new this();
  }

  public static sync(): void {
    try {
      this.connection.query(
        `CREATE TABLE IF NOT EXISTS ${this.tableName} (id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY (id))`
      );
    } catch (error) {
      console.log("Erro na sincronização: " + error);
    }
  }
}
