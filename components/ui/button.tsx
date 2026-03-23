import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obys-gold focus-visible:ring-offset-2 focus-visible:ring-offset-obys-near-black disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-obys-gold text-black hover:bg-obys-gold-hover font-display tracking-wide",
        "obys-primary":
          "bg-obys-gold text-black hover:bg-obys-gold-hover font-display tracking-wide",
        "obys-secondary":
          "bg-obys-orange text-black hover:opacity-90 font-display tracking-wide",
        "obys-dark":
          "bg-obys-dark text-white hover:bg-obys-border-dark font-body",
        "obys-light":
          "bg-white text-black hover:bg-obys-text-light font-body",
        "obys-black":
          "bg-black text-white border border-obys-border-dark hover:bg-obys-dark font-body",
        "outline-primary":
          "border border-obys-gold text-obys-gold bg-transparent hover:bg-obys-gold hover:text-black font-display tracking-wide",
        "outline-dark":
          "border border-obys-border-dark text-white bg-transparent hover:bg-obys-dark font-body",
        "outline-light":
          "border border-white text-white bg-transparent hover:bg-white hover:text-black font-body",
        play: "rounded-full bg-obys-gold text-black hover:scale-110 font-body",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-obys-gold bg-transparent text-obys-gold hover:bg-obys-gold hover:text-black",
        secondary:
          "bg-obys-dark text-white hover:bg-obys-border-dark",
        ghost:
          "text-obys-text-secondary hover:text-white hover:bg-obys-dark",
        link: "text-obys-gold underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
        play: "h-20 w-20",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={{
          transitionDuration: "var(--duration-default)",
          transitionTimingFunction: "var(--ease-default)",
        }}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
