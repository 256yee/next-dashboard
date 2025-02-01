"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";
import postgres from "postgres";
import { redirect } from "next/navigation";

// 使用 Zod 进行表单数据验证。
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

// 去掉 id 和 date，因为 id 由数据库自动生成，date 由后端自动设置。
const CreateInvoice = FormSchema.omit({ id: true, date: true });

// ↓如果使用 zod 进行数据验证时，数据类型不匹配（比如 id 传入了非 string 的数据），zod 会 抛出错误，导致代码执行失败。
export async function createInvoice(formData: FormData) {
  // 第二个 FormData 是表单提交的数据，通常由 <form> 组件提交，或者使用 new FormData(formElement) 创建。
  const { customerId, amount, status } = CreateInvoice.parse({
    // CreateInvoice.parse({...}) 自动验证数据，确保 amount 是数字，status 只允许 "pending" 或 "paid"。
    customerId: formData.get("customerId"), // 从 HTML 表单获取数据。
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100; // amountInCents：金额转换为分（cents），避免浮点误差（例如 $19.99 → 1999）。
  const date = new Date().toISOString().split("T")[0]; // 按格式 YYYY-MM-DD（例如 2024-01-31） 获取当前日期

  await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;

  revalidatePath("/dashboard/invoices"); // 清除 /dashboard/invoices 的缓存，让新数据立即显示。
  redirect("/dashboard/invoices"); // 跳转回发票列表页
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}