import { ReactNode } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";

interface EmployeeLayoutProps {
  children: ReactNode;
}

export const EmployeeLayout = ({ children }: EmployeeLayoutProps) => {
  return <PageWrapper>{children}</PageWrapper>;
};

