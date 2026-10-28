import * as React from "react";
import { cn } from "@/core/lib/utils";

type NativeSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-8 w-full rounded-lg border border-input bg-[rgb(255_253_248_/_85%)] px-2.5 text-sm outline-none transition-colors focus:border-[color:var(--brand-gold)] focus:ring-3 focus:ring-[rgb(245_184_0_/_35%)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);

NativeSelect.displayName = "NativeSelect";

export { NativeSelect };
