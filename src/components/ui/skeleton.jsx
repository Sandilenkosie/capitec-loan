import { cn } from "@/lib/utils"

/**
 * Render a div styled as a loading skeleton, merging default classes with any provided classes.
 * @param {string} className - Additional CSS class names to append to the default skeleton classes.
 * @param {object} props - Additional props to spread onto the root div (e.g., id, role, style).
 * @returns {JSX.Element} The div element used as a visual loading skeleton.
 */
function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props} />
  );
}

export { Skeleton }