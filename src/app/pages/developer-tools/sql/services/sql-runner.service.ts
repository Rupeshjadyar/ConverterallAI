import { Injectable } from '@angular/core';

export interface SqlQueryResult {
  columns: string[];
  rows: any[][];
  executionTimeMs: number;
  rowCount: number;
  message?: string;
  error?: string;
}

export interface TableSchema {
  name: string;
  columns: { name: string; type: string; key?: string }[];
  rowCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class SqlRunnerService {

  // In-memory database tables matching the exact slides
  private initialDatabase: Record<string, { columns: string[]; rows: any[][] }> = {
    students: {
      columns: ['roll_no', 'name', 'address', 'age', 'marks'],
      rows: [
        [1, 'Harsh', 'Delhi', 18, 85],
        [2, 'Pratik', 'Bihar', 19, 90],
        [3, 'Priyanka', 'Siliguri', 20, 78],
        [4, 'Deep', 'Ramnagar', 18, 92],
        [5, 'Saptrahi', 'Kolkata', 19, 88],
        [6, 'Dhanraj', 'Barabajar', 20, 75],
        [7, 'Rohit', 'Balurghat', 18, 82],
        [8, 'Niraj', 'Alipur', 19, 95],
        [9, 'Aditi', 'Thane', 25, 94],
        [10, 'Simran', 'Pune', 24, 89]
      ]
    },
    course: {
      columns: ['course_id', 'roll_no'],
      rows: [
        [1, 1],
        [2, 2],
        [2, 3],
        [3, 4],
        [1, 5],
        [4, 9],
        [5, 10],
        [4, 11]
      ]
    },
    employees: {
      columns: ['id', 'name', 'city', 'salary', 'dept_no', 'designation', 'manager_id', 'officeCode'],
      rows: [
        [1, 'Aditi', 'Thane', 30000, 5, 'HR', 3, 1],
        [2, 'John', 'Pune', 40000, 5, 'HR', 3, 2],
        [3, 'Smith', 'Nagpur', 25000, 4, 'Manager', 4, 3],
        [4, 'Ravi', 'Mumbai', 43000, 4, 'Analyst', 5, 1],
        [5, 'Riya', 'Nagpur', 38000, 5, 'Clerk', 6, 2],
        [6, 'Tina', 'Mumbai', 25000, 5, 'Analyst', null, 3],
        [7, 'Manisha', 'Pune', 25000, 4, 'Operations', 6, 1],
        [8, 'James', 'Mumbai', 55000, 1, 'Clerk', 6, 2],
        [20, 'George', 'Delhi', 52000, 2, 'Senior Manager', null, 3],
        [30, 'Vikram', 'Bangalore', 60000, 2, 'Director', null, 3],
        [100, 'Ankit', 'Lucknow', 15000, 3, 'Junior Dev', 20, 1],
        [101, 'Raman', 'Allahabad', 18000, 3, 'Junior Dev', 20, 1],
        [102, 'Mike', 'New York', 20000, 3, 'Developer', 20, 2],
        [104, 'David', 'Chicago', 20145, 2, 'Lead Analyst', 20, 3]
      ]
    },
    emp_info: {
      columns: ['emp_id', 'name', 'age', 'city', 'salary', 'designation'],
      rows: [
        [101, 'Aditi', 25, 'Thane', 10000, 'Trainee'],
        [102, 'Riya', 24, 'Pune', 22000, 'Executive'],
        [103, 'Raj', 27, 'Mumbai', 5000, 'Intern'],
        [104, 'Diya', 28, 'Nagpur', 7000, 'Assistant'],
        [105, 'Ravi', 24, 'Jaipur', 10000, 'Executive'],
        [106, 'Priya', 25, 'Thane', 5000, 'Intern'],
        [107, 'Manisha', 28, 'Pune', 22000, 'Manager'],
        [108, 'Seema', 28, 'Mumbai', 20000, 'Manager']
      ]
    },
    demo1: {
      columns: ['id', 'name'],
      rows: [
        [1, 'Aditi'],
        [2, 'Simran']
      ]
    }
  };

  private currentDb: Record<string, { columns: string[]; rows: any[][] }> = {};

  constructor() {
    this.resetDatabase();
  }

  resetDatabase() {
    this.currentDb = JSON.parse(JSON.stringify(this.initialDatabase));
  }

  getTableSchemas(): TableSchema[] {
    return Object.keys(this.currentDb).map(tableName => {
      const table = this.currentDb[tableName];
      return {
        name: tableName,
        rowCount: table.rows.length,
        columns: table.columns.map((c, i) => ({
          name: c,
          type: typeof (table.rows[0]?.[i] ?? 0) === 'number' ? 'INT' : 'VARCHAR',
          key: (c.toLowerCase().includes('id') || c.toLowerCase().includes('roll')) && i === 0 ? 'PRI' : undefined
        }))
      };
    });
  }

  execute(rawQuery: string): SqlQueryResult {
    const startTime = performance.now();
    const cleanQuery = rawQuery.trim().replace(/;+$/, '').trim();

    if (!cleanQuery) {
      return {
        columns: [],
        rows: [],
        executionTimeMs: 0,
        rowCount: 0,
        error: 'Query is empty. Please enter an SQL query.'
      };
    }

    try {
      const lower = cleanQuery.toLowerCase();

      // SHOW TABLES
      if (lower === 'show tables' || lower === 'show databases') {
        const tableNames = Object.keys(this.currentDb);
        const rows = tableNames.map(t => [t]);
        const executionTimeMs = +(performance.now() - startTime).toFixed(2);
        return {
          columns: [lower === 'show databases' ? 'Database' : 'Tables_in_db'],
          rows: lower === 'show databases' ? [['converterall_db'], ['student'], ['company_db']] : rows,
          executionTimeMs,
          rowCount: rows.length,
          message: `${rows.length} rows in set`
        };
      }

      // DESCRIBE or DESC table
      const descMatch = cleanQuery.match(/^(?:describe|desc)\s+([a-zA-Z0-9_]+)/i);
      if (descMatch) {
        const tbl = descMatch[1].toLowerCase();
        if (!this.currentDb[tbl]) {
          throw new Error(`Table '${tbl}' doesn't exist.`);
        }
        const table = this.currentDb[tbl];
        const rows = table.columns.map((col, idx) => [
          col,
          typeof (table.rows[0]?.[idx] ?? 0) === 'number' ? 'int(11)' : 'varchar(100)',
          idx === 0 ? 'NO' : 'YES',
          idx === 0 ? 'PRI' : '',
          'NULL',
          ''
        ]);
        return {
          columns: ['Field', 'Type', 'Null', 'Key', 'Default', 'Extra'],
          rows,
          executionTimeMs: +(performance.now() - startTime).toFixed(2),
          rowCount: rows.length
        };
      }

      // SELECT
      if (lower.startsWith('select')) {
        return this.handleSelect(cleanQuery, startTime);
      }

      // INSERT INTO
      if (lower.startsWith('insert into')) {
        return this.handleInsert(cleanQuery, startTime);
      }

      // UPDATE
      if (lower.startsWith('update')) {
        return this.handleUpdate(cleanQuery, startTime);
      }

      // DELETE FROM
      if (lower.startsWith('delete from') || lower.startsWith('delete')) {
        return this.handleDelete(cleanQuery, startTime);
      }

      // CREATE TABLE
      if (lower.startsWith('create table')) {
        const match = cleanQuery.match(/create\s+table\s+([a-zA-Z0-9_]+)\s*\(([\s\S]+)\)/i);
        if (match) {
          const tableName = match[1].toLowerCase();
          const colDefs = match[2].split(',').map(s => s.trim().split(/\s+/)[0]).filter(c => c && !['primary', 'foreign', 'constraint'].includes(c.toLowerCase()));
          this.currentDb[tableName] = {
            columns: colDefs,
            rows: []
          };
          return {
            columns: ['Status'],
            rows: [[`Query OK, 0 rows affected. Table '${tableName}' created.`]],
            executionTimeMs: +(performance.now() - startTime).toFixed(2),
            rowCount: 0,
            message: `Table '${tableName}' created successfully.`
          };
        }
      }

      // TRUNCATE TABLE
      if (lower.startsWith('truncate')) {
        const match = cleanQuery.match(/truncate\s+(?:table\s+)?([a-zA-Z0-9_]+)/i);
        if (match) {
          const tableName = match[1].toLowerCase();
          if (this.currentDb[tableName]) {
            this.currentDb[tableName].rows = [];
            return {
              columns: ['Status'],
              rows: [[`Query OK, 0 rows affected. Table '${tableName}' truncated.`]],
              executionTimeMs: +(performance.now() - startTime).toFixed(2),
              rowCount: 0,
              message: `Table '${tableName}' truncated successfully (all rows cleared).`
            };
          } else {
            throw new Error(`Table '${tableName}' does not exist.`);
          }
        }
      }

      // DROP TABLE
      if (lower.startsWith('drop table')) {
        const match = cleanQuery.match(/drop\s+table\s+([a-zA-Z0-9_]+)/i);
        if (match) {
          const tableName = match[1].toLowerCase();
          delete this.currentDb[tableName];
          return {
            columns: ['Status'],
            rows: [[`Query OK, 0 rows affected. Table '${tableName}' dropped.`]],
            executionTimeMs: +(performance.now() - startTime).toFixed(2),
            rowCount: 0,
            message: `Table '${tableName}' dropped.`
          };
        }
      }

      throw new Error(`Unsupported or unrecognized SQL command. Try SELECT, INSERT, UPDATE, DELETE, SHOW TABLES, or DESC.`);
    } catch (err: any) {
      return {
        columns: [],
        rows: [],
        executionTimeMs: +(performance.now() - startTime).toFixed(2),
        rowCount: 0,
        error: err.message || 'Error executing SQL query.'
      };
    }
  }

  private handleSelect(query: string, startTime: number): SqlQueryResult {
    // Basic SELECT parser
    // Check if SELECT without FROM, e.g. SELECT (15 + 6) AS ADDITION, SELECT CURRENT_TIMESTAMP, SELECT CONCAT('a','b')
    const hasFrom = /\s+from\s+/i.test(query);
    if (!hasFrom) {
      return this.handleScalarSelect(query, startTime);
    }

    // Extract clauses
    const fromSplit = query.split(/\s+from\s+/i);
    const selectPart = fromSplit[0].replace(/^select\s+/i, '').trim();
    const rest = fromSplit.slice(1).join(' FROM ');

    // Extract table name and JOIN
    let tableName = '';
    let joinType = '';
    let joinTable = '';
    let joinCondition = '';

    const joinMatch = rest.match(/([a-zA-Z0-9_]+)\s+(inner\s+join|left\s+join|right\s+join|cross\s+join|join)\s+([a-zA-Z0-9_]+)\s+on\s+([^\s]+)\s*=\s*([^\s]+)/i);
    let afterTablePart = rest;

    if (joinMatch) {
      tableName = joinMatch[1].toLowerCase();
      joinType = joinMatch[2].toLowerCase();
      joinTable = joinMatch[3].toLowerCase();
      joinCondition = `${joinMatch[4]}=${joinMatch[5]}`;
      afterTablePart = rest.substring(joinMatch[0].length);
    } else {
      const tableMatch = rest.match(/^([a-zA-Z0-9_]+)/i);
      if (!tableMatch) throw new Error("Invalid FROM clause.");
      tableName = tableMatch[1].toLowerCase();
      afterTablePart = rest.substring(tableMatch[0].length);
    }

    const baseTable = this.currentDb[tableName];
    if (!baseTable) {
      throw new Error(`Table '${tableName}' doesn't exist.`);
    }

    // Construct raw dataset
    let dataset: { columns: string[]; rows: any[][] };

    if (joinTable) {
      const secondTable = this.currentDb[joinTable];
      if (!secondTable) throw new Error(`Table '${joinTable}' doesn't exist.`);
      dataset = this.performJoin(tableName, baseTable, joinTable, secondTable, joinType, joinCondition);
    } else {
      dataset = {
        columns: [...baseTable.columns],
        rows: baseTable.rows.map(r => [...r])
      };
    }

    // WHERE clause
    const whereMatch = afterTablePart.match(/\s+where\s+([\s\S]*?)(?:\s+group\s+by|\s+order\s+by|\s+limit|$)/i);
    if (whereMatch) {
      const whereCondition = whereMatch[1].trim();
      dataset.rows = dataset.rows.filter(row => this.evaluateCondition(whereCondition, row, dataset.columns));
    }

    // GROUP BY clause
    const groupMatch = afterTablePart.match(/\s+group\s+by\s+([\s\S]*?)(?:\s+having|\s+order\s+by|\s+limit|$)/i);
    let isAggregated = false;
    if (groupMatch) {
      isAggregated = true;
      const groupCols = groupMatch[1].split(',').map(s => s.trim().toLowerCase());
      const havingMatch = afterTablePart.match(/\s+having\s+([\s\S]*?)(?:\s+order\s+by|\s+limit|$)/i);
      const havingCondition = havingMatch ? havingMatch[1].trim() : null;

      dataset = this.performGroupBy(dataset, groupCols, selectPart, havingCondition);
    }

    // Process SELECT projection (columns or aliases)
    let finalCols: string[] = [];
    let finalRows: any[][] = [];

    const isSelectDistinct = /^distinct\s+/i.test(selectPart);
    const cleanSelect = selectPart.replace(/^distinct\s+/i, '').trim();

    if (!isAggregated) {
      if (cleanSelect === '*') {
        finalCols = dataset.columns;
        finalRows = dataset.rows;
      } else {
        const colExpressions = cleanSelect.split(',').map(s => s.trim());
        const projectedIndices: { index: number; name: string; isFunction?: boolean; fnName?: string }[] = [];

        for (const expr of colExpressions) {
          const aliasMatch = expr.match(/(.+?)\s+as\s+([a-zA-Z0-9_]+)/i);
          const rawCol = aliasMatch ? aliasMatch[1].trim() : expr;
          const colName = aliasMatch ? aliasMatch[2].trim() : rawCol;

          // Check for count(*) or sum(col) etc
          const aggMatch = rawCol.match(/^(count|sum|avg|min|max)\((.+?)\)$/i);
          if (aggMatch) {
            const fn = aggMatch[1].toUpperCase();
            const target = aggMatch[2].trim().toLowerCase();
            const colIdx = target === '*' ? 0 : dataset.columns.findIndex(c => c.toLowerCase() === target || c.toLowerCase().endsWith('.' + target));
            
            let val: any = 0;
            if (fn === 'COUNT') val = dataset.rows.length;
            else if (fn === 'SUM' && colIdx !== -1) val = dataset.rows.reduce((acc, r) => acc + (Number(r[colIdx]) || 0), 0);
            else if (fn === 'AVG' && colIdx !== -1) val = +(dataset.rows.reduce((acc, r) => acc + (Number(r[colIdx]) || 0), 0) / (dataset.rows.length || 1)).toFixed(2);
            else if (fn === 'MIN' && colIdx !== -1) val = Math.min(...dataset.rows.map(r => Number(r[colIdx]) || 0));
            else if (fn === 'MAX' && colIdx !== -1) val = Math.max(...dataset.rows.map(r => Number(r[colIdx]) || 0));

            return {
              columns: [colName],
              rows: [[val]],
              executionTimeMs: +(performance.now() - startTime).toFixed(2),
              rowCount: 1
            };
          }

          // Match normal column
          const simpleName = rawCol.toLowerCase().includes('.') ? rawCol.toLowerCase().split('.')[1] : rawCol.toLowerCase();
          const colIdx = dataset.columns.findIndex(c => c.toLowerCase() === simpleName || c.toLowerCase() === rawCol.toLowerCase());
          projectedIndices.push({
            index: colIdx,
            name: colName
          });
        }

        finalCols = projectedIndices.map(p => p.name);
        finalRows = dataset.rows.map(row => {
          return projectedIndices.map(p => p.index !== -1 ? row[p.index] : null);
        });
      }
    } else {
      finalCols = dataset.columns;
      finalRows = dataset.rows;
    }

    // DISTINCT
    if (isSelectDistinct) {
      const seen = new Set<string>();
      finalRows = finalRows.filter(r => {
        const key = JSON.stringify(r);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    // ORDER BY
    const orderMatch = afterTablePart.match(/\s+order\s+by\s+([\s\S]*?)(?:\s+limit|$)/i);
    if (orderMatch) {
      const orderDef = orderMatch[1].trim();
      const isDesc = /desc$/i.test(orderDef);
      const orderCol = orderDef.replace(/\s+(asc|desc)$/i, '').trim().toLowerCase();
      const colIdx = finalCols.findIndex(c => c.toLowerCase() === orderCol);
      if (colIdx !== -1) {
        finalRows.sort((a, b) => {
          const valA = a[colIdx];
          const valB = b[colIdx];
          if (typeof valA === 'number' && typeof valB === 'number') {
            return isDesc ? valB - valA : valA - valB;
          }
          return isDesc ? String(valB).localeCompare(String(valA)) : String(valA).localeCompare(String(valB));
        });
      }
    }

    // LIMIT
    const limitMatch = afterTablePart.match(/\s+limit\s+([0-9]+)(?:\s*,\s*([0-9]+))?/i);
    if (limitMatch) {
      if (limitMatch[2] !== undefined) {
        const offset = parseInt(limitMatch[1], 10);
        const count = parseInt(limitMatch[2], 10);
        finalRows = finalRows.slice(offset, offset + count);
      } else {
        const count = parseInt(limitMatch[1], 10);
        finalRows = finalRows.slice(0, count);
      }
    }

    const executionTimeMs = +(performance.now() - startTime).toFixed(2);
    return {
      columns: finalCols,
      rows: finalRows,
      executionTimeMs,
      rowCount: finalRows.length,
      message: `${finalRows.length} rows in set (${(executionTimeMs / 1000).toFixed(3)} sec)`
    };
  }

  private handleScalarSelect(query: string, startTime: number): SqlQueryResult {
    const expr = query.replace(/^select\s+/i, '').trim();
    const aliasMatch = expr.match(/(.+?)\s+as\s+([a-zA-Z0-9_]+)/i);
    const targetExpr = aliasMatch ? aliasMatch[1].trim() : expr;
    const colName = aliasMatch ? aliasMatch[2].trim() : expr;

    let result: any = null;
    const lowerExpr = targetExpr.toLowerCase();

    if (lowerExpr === 'current_timestamp' || lowerExpr === 'now()' || lowerExpr === 'sysdate()') {
      const now = new Date();
      result = now.toISOString().replace('T', ' ').substring(0, 19);
    } else if (lowerExpr === 'curdate()') {
      result = new Date().toISOString().substring(0, 10);
    } else if (lowerExpr.startsWith('concat(')) {
      const inner = targetExpr.substring(7, targetExpr.length - 1);
      const parts = inner.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      result = parts.join('');
    } else if (lowerExpr.startsWith('lower(')) {
      const inner = targetExpr.substring(6, targetExpr.length - 1).trim().replace(/^['"]|['"]$/g, '');
      result = inner.toLowerCase();
    } else if (lowerExpr.startsWith('upper(')) {
      const inner = targetExpr.substring(6, targetExpr.length - 1).trim().replace(/^['"]|['"]$/g, '');
      result = inner.toUpperCase();
    } else if (lowerExpr.startsWith('abs(')) {
      const inner = parseFloat(targetExpr.substring(4, targetExpr.length - 1));
      result = Math.abs(inner);
    } else if (lowerExpr.startsWith('mod(')) {
      const nums = targetExpr.substring(4, targetExpr.length - 1).split(',').map(s => parseFloat(s.trim()));
      result = nums[0] % nums[1];
    } else if (lowerExpr.startsWith('floor(')) {
      const inner = parseFloat(targetExpr.substring(6, targetExpr.length - 1));
      result = Math.floor(inner);
    } else if (lowerExpr.startsWith('ceiling(') || lowerExpr.startsWith('ceil(')) {
      const match = targetExpr.match(/\((.+?)\)/);
      result = Math.ceil(parseFloat(match ? match[1] : '0'));
    } else if (lowerExpr.startsWith('sqrt(')) {
      const inner = parseFloat(targetExpr.substring(5, targetExpr.length - 1));
      result = Math.sqrt(inner);
    } else if (lowerExpr.startsWith('power(')) {
      const nums = targetExpr.substring(6, targetExpr.length - 1).split(',').map(s => parseFloat(s.trim()));
      result = Math.pow(nums[0], nums[1]);
    } else if (lowerExpr.startsWith('if(')) {
      result = 'yes';
    } else {
      // evaluate basic arithmetic e.g. (15 + 6)
      try {
        const sanitized = targetExpr.replace(/[^0-9+\-*/().]/g, '');
        // eslint-disable-next-line no-eval
        result = Function(`'use strict'; return (${sanitized})`)();
      } catch {
        result = targetExpr;
      }
    }

    return {
      columns: [colName],
      rows: [[result]],
      executionTimeMs: +(performance.now() - startTime).toFixed(2),
      rowCount: 1
    };
  }

  private performJoin(tbl1Name: string, tbl1: { columns: string[]; rows: any[][] }, tbl2Name: string, tbl2: { columns: string[]; rows: any[][] }, type: string, cond: string): { columns: string[]; rows: any[][] } {
    const colNames = [
      ...tbl1.columns.map(c => `${tbl1Name}.${c}`),
      ...tbl2.columns.map(c => `${tbl2Name}.${c}`)
    ];

    const condParts = cond.split('=');
    const leftCol = condParts[0].trim().toLowerCase().split('.').pop()!;
    const rightCol = condParts[1].trim().toLowerCase().split('.').pop()!;

    const leftIdx = tbl1.columns.findIndex(c => c.toLowerCase() === leftCol);
    const rightIdx = tbl2.columns.findIndex(c => c.toLowerCase() === rightCol);

    const mergedRows: any[][] = [];

    if (type.includes('inner') || type === 'join') {
      for (const r1 of tbl1.rows) {
        for (const r2 of tbl2.rows) {
          if (r1[leftIdx] == r2[rightIdx]) {
            mergedRows.push([...r1, ...r2]);
          }
        }
      }
    } else if (type.includes('left')) {
      for (const r1 of tbl1.rows) {
        let matched = false;
        for (const r2 of tbl2.rows) {
          if (r1[leftIdx] == r2[rightIdx]) {
            mergedRows.push([...r1, ...r2]);
            matched = true;
          }
        }
        if (!matched) {
          mergedRows.push([...r1, ...new Array(tbl2.columns.length).fill(null)]);
        }
      }
    } else if (type.includes('right')) {
      for (const r2 of tbl2.rows) {
        let matched = false;
        for (const r1 of tbl1.rows) {
          if (r1[leftIdx] == r2[rightIdx]) {
            mergedRows.push([...r1, ...r2]);
            matched = true;
          }
        }
        if (!matched) {
          mergedRows.push([...new Array(tbl1.columns.length).fill(null), ...r2]);
        }
      }
    } else if (type.includes('cross')) {
      for (const r1 of tbl1.rows) {
        for (const r2 of tbl2.rows) {
          mergedRows.push([...r1, ...r2]);
        }
      }
    }

    return { columns: colNames, rows: mergedRows };
  }

  private performGroupBy(dataset: { columns: string[]; rows: any[][] }, groupCols: string[], selectPart: string, havingCond: string | null): { columns: string[]; rows: any[][] } {
    const groupIndices = groupCols.map(g => {
      const clean = g.includes('.') ? g.split('.')[1] : g;
      return dataset.columns.findIndex(c => c.toLowerCase() === clean || c.toLowerCase().endsWith('.' + clean));
    });

    const groups: Record<string, any[][]> = {};
    for (const row of dataset.rows) {
      const key = groupIndices.map(idx => idx !== -1 ? row[idx] : '').join('___');
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    }

    const selectItems = selectPart.split(',').map(s => s.trim());
    const resultCols: string[] = [];
    const resultRows: any[][] = [];

    // Parse projection columns
    const projectors: { name: string; fn: (groupRows: any[][]) => any }[] = [];

    for (const item of selectItems) {
      const aliasMatch = item.match(/(.+?)\s+as\s+([a-zA-Z0-9_]+)/i);
      const raw = aliasMatch ? aliasMatch[1].trim() : item;
      const colName = aliasMatch ? aliasMatch[2].trim() : item;
      resultCols.push(colName);

      const aggMatch = raw.match(/^(count|sum|avg|min|max)\((.+?)\)$/i);
      if (aggMatch) {
        const fnName = aggMatch[1].toUpperCase();
        const target = aggMatch[2].trim().toLowerCase();
        const colIdx = target === '*' ? 0 : dataset.columns.findIndex(c => c.toLowerCase() === target || c.toLowerCase().endsWith('.' + target));

        projectors.push({
          name: colName,
          fn: (rows) => {
            if (fnName === 'COUNT') return rows.length;
            if (fnName === 'SUM') return rows.reduce((acc, r) => acc + (Number(r[colIdx]) || 0), 0);
            if (fnName === 'AVG') return +(rows.reduce((acc, r) => acc + (Number(r[colIdx]) || 0), 0) / (rows.length || 1)).toFixed(2);
            if (fnName === 'MIN') return Math.min(...rows.map(r => Number(r[colIdx]) || 0));
            if (fnName === 'MAX') return Math.max(...rows.map(r => Number(r[colIdx]) || 0));
            return 0;
          }
        });
      } else {
        const cleanCol = raw.toLowerCase().includes('.') ? raw.toLowerCase().split('.')[1] : raw.toLowerCase();
        const colIdx = dataset.columns.findIndex(c => c.toLowerCase() === cleanCol || c.toLowerCase().endsWith('.' + cleanCol));
        projectors.push({
          name: colName,
          fn: (rows) => colIdx !== -1 ? rows[0][colIdx] : null
        });
      }
    }

    for (const key of Object.keys(groups)) {
      const gRows = groups[key];
      const rowOutput = projectors.map(p => p.fn(gRows));

      if (havingCond) {
        // e.g. having sum(salary) > 10000 or count(*) > 2
        const matchAgg = havingCond.match(/(sum|count|min|max|avg)\((.+?)\)\s*(>|<|=|>=|<=)\s*([0-9]+)/i);
        if (matchAgg) {
          const fn = matchAgg[1].toUpperCase();
          const target = matchAgg[2].trim().toLowerCase();
          const op = matchAgg[3];
          const threshold = parseFloat(matchAgg[4]);

          const colIdx = target === '*' ? 0 : dataset.columns.findIndex(c => c.toLowerCase() === target || c.toLowerCase().endsWith('.' + target));
          let compVal = 0;
          if (fn === 'COUNT') compVal = gRows.length;
          else if (fn === 'SUM') compVal = gRows.reduce((acc, r) => acc + (Number(r[colIdx]) || 0), 0);
          else if (fn === 'MIN') compVal = Math.min(...gRows.map(r => Number(r[colIdx]) || 0));
          else if (fn === 'MAX') compVal = Math.max(...gRows.map(r => Number(r[colIdx]) || 0));

          let passes = false;
          if (op === '>' && compVal > threshold) passes = true;
          if (op === '<' && compVal < threshold) passes = true;
          if (op === '>=' && compVal >= threshold) passes = true;
          if (op === '<=' && compVal <= threshold) passes = true;
          if (op === '=' && compVal === threshold) passes = true;

          if (!passes) continue;
        }
      }

      resultRows.push(rowOutput);
    }

    return { columns: resultCols, rows: resultRows };
  }

  private evaluateCondition(condition: string, row: any[], columns: string[]): boolean {
    const cond = condition.trim();

    // Handle AND / OR
    if (/\s+and\s+/i.test(cond)) {
      const subParts = cond.split(/\s+and\s+/i);
      return subParts.every(p => this.evaluateCondition(p, row, columns));
    }
    if (/\s+or\s+/i.test(cond)) {
      const subParts = cond.split(/\s+or\s+/i);
      return subParts.some(p => this.evaluateCondition(p, row, columns));
    }

    // IS NULL / IS NOT NULL
    const nullMatch = cond.match(/^([a-zA-Z0-9_.]+)\s+is\s+(not\s+)?null/i);
    if (nullMatch) {
      const colName = nullMatch[1].toLowerCase().split('.').pop()!;
      const isNot = !!nullMatch[2];
      const idx = columns.findIndex(c => c.toLowerCase().endsWith(colName));
      if (idx === -1) return true;
      const isNull = row[idx] === null || row[idx] === undefined;
      return isNot ? !isNull : isNull;
    }

    // BETWEEN x AND y
    const betweenMatch = cond.match(/^([a-zA-Z0-9_.]+)\s+(not\s+)?between\s+([0-9.]+)\s+and\s+([0-9.]+)/i);
    if (betweenMatch) {
      const colName = betweenMatch[1].toLowerCase().split('.').pop()!;
      const isNot = !!betweenMatch[2];
      const low = parseFloat(betweenMatch[3]);
      const high = parseFloat(betweenMatch[4]);
      const idx = columns.findIndex(c => c.toLowerCase().endsWith(colName));
      if (idx === -1) return true;
      const val = parseFloat(row[idx]);
      const inside = val >= low && val <= high;
      return isNot ? !inside : inside;
    }

    // IN (v1, v2, ...)
    const inMatch = cond.match(/^([a-zA-Z0-9_.]+)\s+(not\s+)?in\s*\(([\s\S]+?)\)/i);
    if (inMatch) {
      const colName = inMatch[1].toLowerCase().split('.').pop()!;
      const isNot = !!inMatch[2];
      const listVals = inMatch[3].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      const idx = columns.findIndex(c => c.toLowerCase().endsWith(colName));
      if (idx === -1) return true;
      const val = String(row[idx]);
      const matches = listVals.some(v => v == val);
      return isNot ? !matches : matches;
    }

    // LIKE '%xyz%'
    const likeMatch = cond.match(/^([a-zA-Z0-9_.]+)\s+(not\s+)?like\s+['"](.+?)['"]/i);
    if (likeMatch) {
      const colName = likeMatch[1].toLowerCase().split('.').pop()!;
      const isNot = !!likeMatch[2];
      const pattern = likeMatch[3];
      const idx = columns.findIndex(c => c.toLowerCase().endsWith(colName));
      if (idx === -1) return true;
      const val = String(row[idx] ?? '');

      const regexPattern = '^' + pattern.replace(/%/g, '.*').replace(/_/g, '.') + '$';
      const regex = new RegExp(regexPattern, 'i');
      const matches = regex.test(val);
      return isNot ? !matches : matches;
    }

    // Standard Comparison: >, <, >=, <=, =, !=, <>
    const compMatch = cond.match(/^([a-zA-Z0-9_.]+)\s*(>=|<=|!=|<>|>|<|=)\s*(.+)$/i);
    if (compMatch) {
      const colName = compMatch[1].toLowerCase().split('.').pop()!;
      const op = compMatch[2];
      let rightValStr = compMatch[3].trim().replace(/^['"]|['"]$/g, '');
      const idx = columns.findIndex(c => c.toLowerCase().endsWith(colName));
      if (idx === -1) return true;
      const leftVal = row[idx];

      const isNum = !isNaN(Number(leftVal)) && !isNaN(Number(rightValStr));
      const l = isNum ? Number(leftVal) : String(leftVal).toLowerCase();
      const r = isNum ? Number(rightValStr) : rightValStr.toLowerCase();

      if (op === '=') return l == r;
      if (op === '!=' || op === '<>') return l != r;
      if (op === '>') return l > r;
      if (op === '<') return l < r;
      if (op === '>=') return l >= r;
      if (op === '<=') return l <= r;
    }

    return true;
  }

  private handleInsert(query: string, startTime: number): SqlQueryResult {
    const match = query.match(/insert\s+into\s+([a-zA-Z0-9_]+)(?:\s*\((.+?)\))?\s+values\s*\((.+?)\)/i);
    if (!match) throw new Error("Invalid INSERT statement. Syntax: INSERT INTO table [(col1, col2)] VALUES (v1, v2);");

    const tableName = match[1].toLowerCase();
    const table = this.currentDb[tableName];
    if (!table) throw new Error(`Table '${tableName}' doesn't exist.`);

    const valStrings = match[3].split(',').map(s => {
      const str = s.trim().replace(/^['"]|['"]$/g, '');
      return !isNaN(Number(str)) && str !== '' ? Number(str) : str;
    });

    if (match[2]) {
      const colNames = match[2].split(',').map(s => s.trim().toLowerCase());
      const newRow = new Array(table.columns.length).fill(null);
      colNames.forEach((c, idx) => {
        const targetIdx = table.columns.findIndex(col => col.toLowerCase() === c);
        if (targetIdx !== -1) newRow[targetIdx] = valStrings[idx];
      });
      table.rows.push(newRow);
    } else {
      table.rows.push(valStrings);
    }

    return {
      columns: ['Status'],
      rows: [['Query OK, 1 row affected']],
      executionTimeMs: +(performance.now() - startTime).toFixed(2),
      rowCount: 1,
      message: '1 row inserted successfully.'
    };
  }

  private handleUpdate(query: string, startTime: number): SqlQueryResult {
    const match = query.match(/update\s+([a-zA-Z0-9_]+)\s+set\s+([\s\S]+?)(?:\s+where\s+([\s\S]+))?$/i);
    if (!match) throw new Error("Invalid UPDATE statement. Syntax: UPDATE table SET col=val [WHERE cond];");

    const tableName = match[1].toLowerCase();
    const table = this.currentDb[tableName];
    if (!table) throw new Error(`Table '${tableName}' doesn't exist.`);

    const setParts = match[2].split(',').map(s => s.trim().split(/\s*=\s*/));
    const whereCond = match[3] ? match[3].trim() : null;

    let updatedCount = 0;
    for (const row of table.rows) {
      if (!whereCond || this.evaluateCondition(whereCond, row, table.columns)) {
        for (const [colName, valRaw] of setParts) {
          const colIdx = table.columns.findIndex(c => c.toLowerCase() === colName.toLowerCase());
          if (colIdx !== -1) {
            const cleanVal = valRaw.trim().replace(/^['"]|['"]$/g, '');
            row[colIdx] = !isNaN(Number(cleanVal)) && cleanVal !== '' ? Number(cleanVal) : cleanVal;
          }
        }
        updatedCount++;
      }
    }

    return {
      columns: ['Status'],
      rows: [[`Query OK, ${updatedCount} rows affected`]],
      executionTimeMs: +(performance.now() - startTime).toFixed(2),
      rowCount: updatedCount,
      message: `${updatedCount} row(s) updated successfully.`
    };
  }

  private handleDelete(query: string, startTime: number): SqlQueryResult {
    const match = query.match(/delete\s+from\s+([a-zA-Z0-9_]+)(?:\s+where\s+([\s\S]+))?$/i);
    if (!match) throw new Error("Invalid DELETE statement. Syntax: DELETE FROM table [WHERE condition];");

    const tableName = match[1].toLowerCase();
    const table = this.currentDb[tableName];
    if (!table) throw new Error(`Table '${tableName}' doesn't exist.`);

    const whereCond = match[2] ? match[2].trim() : null;
    const initialLen = table.rows.length;

    if (!whereCond) {
      table.rows = [];
      const affected = initialLen;
      return {
        columns: ['Status'],
        rows: [[`Query OK, ${affected} rows affected`]],
        executionTimeMs: +(performance.now() - startTime).toFixed(2),
        rowCount: affected,
        message: `${affected} row(s) deleted.`
      };
    }

    table.rows = table.rows.filter(row => !this.evaluateCondition(whereCond, row, table.columns));
    const deletedCount = initialLen - table.rows.length;

    return {
      columns: ['Status'],
      rows: [[`Query OK, ${deletedCount} rows affected`]],
      executionTimeMs: +(performance.now() - startTime).toFixed(2),
      rowCount: deletedCount,
      message: `${deletedCount} row(s) deleted.`
    };
  }
}
