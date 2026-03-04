import { Pool } from 'pg';
import { pool } from '../config/db';

export class BaseService<T> {
  protected tableName: string;
  protected pool: Pool;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.pool = pool;
  }

  async create(data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const placeholders = keys.map((_, i) => `$${i + 1}`).join(',');

    const query = `
      INSERT INTO ${this.tableName} (${keys.join(', ')})
      VALUES (${placeholders})
      RETURNING *;
    `;

    const result = await this.pool.query(query, values);
    return result.rows[0] as T;
  }

  async findById(id: number): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE ID =$1`;
    const result = await this.pool.query(query, [id]);

    return result.rows.length > 0 ? (result.rows[0] as T) : null;
  }

  async findAll(options: Partial<T>): Promise<T[]> {
    let query = `SELECT * FROM ${this.tableName}`;
    const values = [];

    if (options && Object.keys(options).length > 0) {
      const conditions = Object.keys(options)
        .map((key, index) => {
          values.push((options as any)[key]);
          return `${key} = $${index + 1}`;
        })
        .join(' AND ');
      query += ` WHERE ${conditions}`;
    }
    const result = await this.pool.query(query);
    return result.rows as T[];
  }

  async update(id: number, data: Partial<T>): Promise<boolean> {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE id = $${keys.length + 1}
    `;

    const result = await this.pool.query(query, [...values, id]);
    return (result.rowCount ?? 0) > 0;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE ID = $1`;
    const result = await this.pool.query(query, [id]);

    return (result.rowCount ?? 0) > 0;
  }
}
