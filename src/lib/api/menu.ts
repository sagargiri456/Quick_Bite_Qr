import { MenuItem } from "@/types/menu";

export type NewMenuItem = Omit<MenuItem, "id" | "created_at" | "updated_at">;

export async function getMenuItems(): Promise<MenuItem[]> {
  const res = await fetch("/api/menus");
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getMenuItem(id: number): Promise<MenuItem> {
  const res = await fetch(`/api/menu/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function addMenuItem(item: NewMenuItem): Promise<MenuItem> {
  const res = await fetch("/api/menu", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateMenuItem(
  id: number,
  updates: Partial<MenuItem>
): Promise<MenuItem> {
  const res = await fetch(`/api/menu/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteMenuItem(id: number): Promise<void> {
  const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}
