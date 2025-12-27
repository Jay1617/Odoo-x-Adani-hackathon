import { useEffect, useState } from "react";
import { categoryService, type MaintenanceCategory } from "@/services/category.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/common/Loader";
import { EmptyState } from "@/components/common/EmptyState";
import { Plus, Wrench, Search, Users, Settings } from "lucide-react";
import { toast } from "react-hot-toast";

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<MaintenanceCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<MaintenanceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxEmployees: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MaintenanceCategory | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
      setFilteredCategories(data);
    } catch (error: any) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
        toast.success("Category updated successfully");
      } else {
        await categoryService.create(formData);
        toast.success("Category created successfully");
      }
      setDialogOpen(false);
      setFormData({ name: "", description: "", maxEmployees: 0 });
      setEditingCategory(null);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category: MaintenanceCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      maxEmployees: category.maxEmployees,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await categoryService.delete(id);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Wrench className="h-8 w-8 text-primary" />
            Maintenance Categories
          </h1>
          <p className="text-muted-foreground text-base">Manage maintenance departments and assign employees</p>
        </div>
        <Button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: "", description: "", maxEmployees: 0 });
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredCategories.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No categories found"
          description={searchTerm ? "Try adjusting your search" : "Get started by creating your first maintenance category"}
          action={{ label: "Add Category", onClick: () => setDialogOpen(true) }}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2 mb-1">
                      <Wrench className="h-5 w-5 text-primary" />
                      {category.name}
                    </CardTitle>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{category.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(category)}
                    className="h-8 w-8"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Assigned Employees
                    </span>
                    <Badge variant="default" className="font-semibold">
                      {category.assignedEmployees?.length || 0}
                      {category.maxEmployees > 0 && ` / ${category.maxEmployees}`}
                    </Badge>
                  </div>
                  {category.maxEmployees > 0 && (
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            ((category.assignedEmployees?.length || 0) / category.maxEmployees) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleDelete(category.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              {editingCategory ? "Edit Category" : "Create Maintenance Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update category details"
                : "Create a new maintenance category (e.g., Mechanic, Electronic, IT Support)"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Mechanic, Electronic, IT Support"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Category description..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxEmployees">Maximum Employees (0 = unlimited)</Label>
              <Input
                id="maxEmployees"
                type="number"
                min="0"
                value={formData.maxEmployees}
                onChange={(e) => setFormData({ ...formData, maxEmployees: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader /> : editingCategory ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

