// lib/efficiency.ts
import { mysqlConn } from "@/lib/mysql";

export async function getProcessEfficiency(process: string) {
  const [zona1] = await mysqlConn.query<any[]>(`
    SELECT 
      machine_1 AS line,
      SUM(plan_qty) AS target,
      SUM(act_qty) AS result
    FROM production_logs
    WHERE process_type = ?
      AND machine_1 IS NOT NULL
    GROUP BY machine_1
    ORDER BY machine_1;
  `, [process]);

  const [zona2] = await mysqlConn.query<any[]>(`
    SELECT 
      machine_2 AS line,
      SUM(plan_qty) AS target,
      SUM(act_qty) AS result
    FROM production_logs
    WHERE process_type = ?
      AND machine_2 IS NOT NULL
    GROUP BY machine_2
    ORDER BY machine_2;
  `, [process]);

  const zona1Eff = zona1.map(r =>
    r.target > 0 ? Math.round((r.result / r.target) * 100) : 0
  );

  const zona2Eff = zona2.map(r =>
    r.target > 0 ? Math.round((r.result / r.target) * 100) : 0
  );

  return {
    zona1Lines: zona1.map(r => r.line),
    zona2Lines: zona2.map(r => r.line),
    zona1: zona1Eff,
    zona2: zona2Eff
  };
}

export async function getLineDetail(process: string, line: string) {
  const [rows] = await mysqlConn.query<any[]>(`
    SELECT
      SUM(plan_qty) AS target,
      SUM(act_qty) AS result,
      SUM(downtime) AS downtime
    FROM production_logs
    WHERE process_type = ?
      AND (machine_1 = ? OR machine_2 = ?)
  `, [process, line, line]);

  const data = rows[0];

  const target = Number(data.target || 0);
  const result = Number(data.result || 0);
  const stop = Number(data.downtime || 0);

  const efficiency = target > 0 ? Math.round((result / target) * 100) : 0;

  return {
    line,
    target,
    result,
    gap: target - result,
    stop,
    efficiency
  };
}