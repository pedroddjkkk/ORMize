import { DbConnection } from "../connection/Connection";

export class Model {
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
}
