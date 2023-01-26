class Model{
    public static get<T extends Model>(this: { new(): T }, id: string): T {
        return new this();
    }
}