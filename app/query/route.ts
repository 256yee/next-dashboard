// 导入Vercel的Postgres数据库客户端
import { db } from "@vercel/postgres";

// 连接到Postgres数据库
const client = await db.connect();

/**
 * 查询并列出特定金额的发票及其对应的客户名称
 * @returns {Promise<Array>} 返回一个包含发票金额和客户名称的数组
 */
async function listInvoices() {
  // 执行SQL查询，获取金额为666的发票及其客户名称
  const data = await client.sql`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
  `;

  // 返回查询结果
  return data.rows;
}

/**
 * 处理GET请求，返回发票数据
 * @returns {Promise<Response>} 返回一个包含发票数据或错误信息的响应对象
 */
export async function GET() {
  try {
    // 成功时，返回发票数据
    return Response.json(await listInvoices());
  } catch (error) {
    // 出现错误时，返回错误信息和500状态码
    return Response.json({ error }, { status: 500 });
  }
}