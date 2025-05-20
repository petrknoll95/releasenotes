"use client";

import { Button } from "@/components/ui/button";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending} {...props} className="w-full p-4 bg-[color-mix(in_srgb,#ffffff_10%,transparent)] hover:bg-[color-mix(in_srgb,#ffffff_20%,transparent)] text-primary font-mono font-medium uppercase text-[12px] leading-none">
      {pending ? pendingText : children}
    </Button>
  );
}
