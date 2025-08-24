import { supabase } from '@/lib/supabase/client';

export interface Table {
  id: number;
  table_number: string;
  qr_code_url: string;
  restaurant_id: string; // Added this property
}

export type NewTableData = {
  table_number: string;
  qr_code_url: string;
  restaurant_id: string; // Added this property
};

// READ all tables (This will now be filtered by RLS policies)
export const getTables = async (): Promise<Table[]> => {
  const { data, error } = await supabase.from('tables').select('*').order('id');
  if (error) throw new Error(error.message);
  return data || [];
};

// CREATE a new table
export const addTable = async (tableData: NewTableData): Promise<Table> => {
  const { data, error } = await supabase.from('tables').insert([tableData]).select().single();
  if (error) throw new Error(error.message);
  return data;
};

// UPDATE a table
export const updateTable = async (id: number, updates: Partial<Table>): Promise<Table> => {
  const { data, error } = await supabase.from('tables').update(updates).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

// DELETE a table
export const deleteTable = async (id: number): Promise<void> => {
  const { error } = await supabase.from('tables').delete().eq('id', id);
  if (error) throw new Error(error.message);
};