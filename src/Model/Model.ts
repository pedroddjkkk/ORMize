import { DbConnection } from "../connection/Connection";

class Model{
    public get<T extends Model>(this: { new(): T }, id: string): T {
      return new this();
    }

    public getAll<T extends Model>(this: { new(): T }): T[] {
      return [new this()];
    }

    public setup<T extends Model>(this: { new(): T }, data: any, connection: DbConnection): T {
      return new this();
    }
}