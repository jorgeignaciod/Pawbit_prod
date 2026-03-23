"use client";

import { InputHTMLAttributes } from "react";

import { Input } from "@/components/ui/input";

export function DateField(props: InputHTMLAttributes<HTMLInputElement>) {
  return <Input type="date" {...props} />;
}
