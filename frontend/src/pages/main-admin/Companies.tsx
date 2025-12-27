import { useEffect, useState } from "react";
import { type Company } from "@/types/company";
import { companyService, type CompanyFormData } from "@/services/company.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/common/Loader";
import { EmptyState } from "@/components/common/EmptyState";
import { Plus, Building2, Mail, Phone, MapPin, Trash2, Edit } from "lucide-react";
import { formatDate } from "@/utils/date";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";

export const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    },
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (error) {
      toast.error("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingCompany) {
        await companyService.update(editingCompany.id, formData);
        toast.success("Company updated successfully");
      } else {
        await companyService.create(formData);
        toast.success("Company created successfully");
      }
      setDialogOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "India",
        },
      });
      setEditingCompany(null);
      fetchCompanies();
    } catch (error: any) {
      toast.error(error.message || "Failed to save company");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      email: company.email || "",
      phone: company.phone || "",
      address: company.address || {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
      },
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this company? This will also delete all associated data.")) return;

    try {
      await companyService.delete(id);
      toast.success("Company deleted successfully");
      fetchCompanies();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete company");
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
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            Companies
          </h1>
          <p className="text-muted-foreground">Manage all companies and their admins</p>
        </div>
        <Button onClick={() => {
          setEditingCompany(null);
          setFormData({
            name: "",
            email: "",
            phone: "",
            address: {
              street: "",
              city: "",
              state: "",
              postalCode: "",
              country: "India",
            },
          });
          setDialogOpen(true);
        }} className="bg-black dark:bg-white text-white dark:text-black">
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      {companies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No companies found"
          description="Get started by adding your first company"
          action={{ label: "Add Company", onClick: () => setDialogOpen(true) }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {company.name}
                    </CardTitle>
                    <Badge variant={company.isActive ? "default" : "secondary"} className="mt-2">
                      {company.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(company)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(company.id)}
                      className="h-8 w-8 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {company.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{company.email}</span>
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{company.phone}</span>
                    </div>
                  )}
                  {company.address?.city && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {company.address.city}
                        {company.address.state && `, ${company.address.state}`}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground pt-2">
                    Created: {formatDate(company.createdAt)}
                  </p>
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
              <Building2 className="h-5 w-5" />
              {editingCompany ? "Edit Company" : "Create Company"}
            </DialogTitle>
            <DialogDescription>
              {editingCompany ? "Update company details" : "Create a new company"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.address?.city || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.address?.state || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, state: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-black dark:bg-white text-white dark:text-black">
                {submitting ? <Loader /> : editingCompany ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
