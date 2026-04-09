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
    const values: unknown[] = [];

    if (options && Object.keys(options).length > 0) {
      const conditions = Object.keys(options)
        .map((key, index) => {
          const value = options[key as keyof T];
          values.push(value);
          return `${key} = $${index + 1}`;
        })
        .join(' AND ');
      query += ` WHERE ${conditions}`;
    }
    const result = await this.pool.query(query, values);
    return result.rows as T[];
  }
  async findOne(options: Partial<T>): Promise<T | null> {
    const allItems = await this.findAll(options);
    return allItems.length > 0 ? allItems[0] : null;
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

  async findMany(condition: Partial<T>): Promise<T[]> {
    const keys = Object.keys(condition);

    const values = Object.values(condition);

    const whereClause = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(' AND ');

    const query = `SELECT * FROM ${this.tableName} WHERE ${whereClause}`;

    const result = await this.pool.query(query, values);

    return result.rows as T[];
  }

}
