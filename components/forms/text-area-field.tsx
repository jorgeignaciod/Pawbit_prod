"use client";

import { TextareaHTMLAttributes } from "react";

import { Textarea } from "@/components/ui/textarea";

export function TextAreaField(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <Textarea {...props} />;
}
