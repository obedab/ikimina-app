import { Pool } from "pg";
import { pool } from "../config/db.js";

export class BaseService<T> {
  protected tableName: string;
  protected pool: Pool;

  constructor(tableName: string) {
    this.tableName = tableName;

    this.pool = pool
  }

  async create(data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values =Object.values(data);

    const placeholders = keys.map((_, i) => `$${i + 1}`).join(",");
    
    const  query = `
      INSERT INTO ${this.tableName} (${keys.join(", ")})
      VALUES (${placeholders})
      RETURNING *;
    `;

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findById(id: number){
   const query = `SELECT * FROM ${this.tableName} WHERE ID =$1`;
   const result = await this.pool.query(query, [id]);

   return result.rows.length > 0 ? result.rows[0] : null
  }

  async findAll(): Promise<T[]> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const result = await this.pool.query(query);

    return result.rows;
  }

   async update(id: number, data: Partial<T>): Promise<boolean> {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const setClause = keys
      .map((key, i) => `${key} = $${i + 1}`)
      .join(", ");

    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE id = $${keys.length + 1}
    `;
    
  const result = await this.pool.query(query, [...values, id]);
    return (result.rowCount ?? 0) > 0;
  }

  async delete(id: number): Promise<boolean> {
    const query =  `DELETE FROM ${ this.tableName} WHERE ID = $1`;
     const result = await this.pool.query(query, [id]); 

    return (result.rowCount ?? 0)> 0;
  }
}
