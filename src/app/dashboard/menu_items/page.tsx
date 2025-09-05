// src/app/dashboard/menu_items/page.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useMenuItems } from "@/lib/hooks/useMenuItems";
import MenuItemCard from "@/components/menu/MenuItemCard";
import DeleteConfirmation from "@/components/menu/DeleteConfirmation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Loader2 } from "lucide-react";
import { MenuItem } from "@/types/menu";

// NOTE: This component seems redundant with /dashboard/menu/page.tsx
// Consider consolidating into one to simplify maintenance.

export default function MenuItemsPage() {
  const { menuItems, loading, error, deleteMenuItem } = useMenuItems();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, menuItems]);

  const handleDeleteClick = (item: MenuItem) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMenuItem(itemToDelete.id);
      toast.success(`"${itemToDelete.name}" was deleted successfully.`);
    } catch {
      toast.error("Failed to delete the item.");
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <>
      <div className="min-h-[80vh] px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800">All Menu Items</h1>
            <Link href="/dashboard/menu/add">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Item
              </Button>
            </Link>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input placeholder="Search menu items..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-slate-500" /></div>
          ) : error ? (
            <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                // FIXED: Corrected the onEdit link to match the actual file structure
                <MenuItemCard key={item.id} item={item} onEdit={`/dashboard/menu/${item.id}/edit`} onDelete={() => handleDeleteClick(item)} />
              ))}
            </div>
          )}
        </div>
      </div>
      <DeleteConfirmation isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={confirmDelete} itemName={itemToDelete?.name || ""} />
    </>
  );
}