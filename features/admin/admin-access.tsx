"use client";

import { useQuery } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

import { getCurrentUser } from "@/features/auth/api";

export function AdminNavigationLink() {
  const profile = useQuery({ queryKey: ["current-user"], queryFn: getCurrentUser });
  if (profile.data?.role !== "admin") return null;
  return <Link href="/admin"><ShieldCheck size={18} />管理</Link>;
}
