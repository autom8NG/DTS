export interface DatabaseSchema {
  tables: string[];
  schema: {
    [tableName: string]: {
      columns: Array<{
        cid: number;
        name: string;
        type: string;
        notnull: number;
        dflt_value: any;
        pk: number;
      }>;
      indexes: Array<{
        seq: number;
        name: string;
        unique: number;
        origin: string;
        partial: number;
      }>;
    };
  };
}

export interface TableData {
  table: string;
  rowCount: number;
  data: any[];
}

export interface DatabaseStats {
  tableCount: number;
  tables: {
    [tableName: string]: {
      rowCount: number;
    };
  };
}

export interface QueryResult {
  rowCount: number;
  data: any[];
}
