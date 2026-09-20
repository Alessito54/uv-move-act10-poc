const ibmdb = require('ibm_db');

export class Db2Connection {
    private static connectionString = process.env.DB2_CONNECTION_STRING || "DATABASE=testdb;HOSTNAME=localhost;UID=db2inst1;PWD=password;PORT=50000;PROTOCOL=TCPIP";

    static async executeQuery(query: string, params: any[] = []): Promise<any[]> {
        return new Promise((resolve, reject) => {
            ibmdb.open(this.connectionString, (err: any, conn: any) => {
                if (err) {
                    return reject(err);
                }

                conn.query(query, params, (err: any, data: any) => {
                    if (err) {
                        conn.closeSync();
                        return reject(err);
                    }

                    conn.close((err: any) => {
                        if (err) {
                            console.error("Error closing DB2 connection", err);
                        }
                    });
                    
                    resolve(data);
                });
            });
        });
    }

    static async executeTransaction(queries: { query: string, params: any[] }[]): Promise<void> {
        return new Promise((resolve, reject) => {
            ibmdb.open(this.connectionString, (err: any, conn: any) => {
                if (err) return reject(err);
                
                conn.beginTransaction((err: any) => {
                    if (err) {
                        conn.closeSync();
                        return reject(err);
                    }
                    
                    const runQuery = (index: number) => {
                        if (index >= queries.length) {
                            return conn.commitTransaction((err: any) => {
                                if (err) {
                                    conn.rollbackTransaction(() => {
                                        conn.closeSync();
                                        reject(err);
                                    });
                                } else {
                                    conn.closeSync();
                                    resolve();
                                }
                            });
                        }
                        
                        const q = queries[index];
                        conn.query(q.query, q.params, (err: any) => {
                            if (err) {
                                return conn.rollbackTransaction(() => {
                                    conn.closeSync();
                                    reject(err);
                                });
                            }
                            runQuery(index + 1);
                        });
                    };
                    
                    runQuery(0);
                });
            });
        });
    }
}
