import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Render a badge element styled according to the specified variant.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional class names to apply to the badge.
 * @param {'default'|'secondary'|'destructive'|'outline'} [props.variant='default'] - Visual variant that controls the badge's appearance.
 * @param {...any} [props.*] - Any other props are passed through to the underlying div (e.g., id, role, data- attributes).
 * @returns {JSX.Element} The rendered div element representing the badge.
 */
function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }