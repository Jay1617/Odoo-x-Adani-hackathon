import { ReactNode } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";

interface CompanyAdminLayoutProps {
  children: ReactNode;
}

export const CompanyAdminLayout = ({ children }: CompanyAdminLayoutProps) => {
  return <PageWrapper>{children}</PageWrapper>;
};

