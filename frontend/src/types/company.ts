export interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  plan?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

