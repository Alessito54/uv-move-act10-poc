export declare class Db2Connection {
    private static connectionString;
    static executeQuery(query: string, params?: any[]): Promise<any[]>;
    static executeTransaction(queries: {
        query: string;
        params: any[];
    }[]): Promise<void>;
}
//# sourceMappingURL=Db2Connection.d.ts.map