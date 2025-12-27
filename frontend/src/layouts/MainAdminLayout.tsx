import { ReactNode } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";

interface MainAdminLayoutProps {
  children: ReactNode;
}

export const MainAdminLayout = ({ children }: MainAdminLayoutProps) => {
  return <PageWrapper>{children}</PageWrapper>;
};

