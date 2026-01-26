import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
// Ensure ButtonProps is exported in button.tsx (from previous step)
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { Link } from "@inertiajs/react"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
  href?: string
} & Pick<ButtonProps, "size"> &
  Omit<React.ComponentProps<typeof Link>, "size">

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  href = "#",
  ...props
}: PaginationLinkProps) => (
  <Link
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size: size as any, // Cast to any to avoid strict type mismatch if button variants are strict
      }),
      className
    )}
    href={href}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

// New Helper Component to render Laravel Links
const LaravelPagination = ({ links }: { links: any[] }) => {
  if (!links || links.length < 2) return null;

  return (
    <Pagination className="mt-4 justify-end">
      <PaginationContent>
        {links.map((link, i) => {
          // Previous
          if (link.label.includes('Previous')) {
            return link.url ? (
              <PaginationItem key={i}>
                <PaginationPrevious href={link.url} />
              </PaginationItem>
            ) : null;
          }
          if (link.label.includes('&laquo;')) {
            return link.url ? (
              <PaginationItem key={i}>
                <PaginationPrevious href={link.url} />
              </PaginationItem>
            ) : null;
          }

          // Next
          if (link.label.includes('Next')) {
            return link.url ? (
              <PaginationItem key={i}>
                <PaginationNext href={link.url} />
              </PaginationItem>
            ) : null;
          }
          if (link.label.includes('&raquo;')) {
            return link.url ? (
              <PaginationItem key={i}>
                <PaginationNext href={link.url} />
              </PaginationItem>
            ) : null;
          }

          // Ellipsis (basic check)
          if (link.label === '...') {
            return (
              <PaginationItem key={i}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          // Number
          return (
            <PaginationItem key={i}>
              <PaginationLink href={link.url || '#'} isActive={link.active}>
                {link.label}
              </PaginationLink>
            </PaginationItem>
          );
        })}
      </PaginationContent>
    </Pagination>
  );
};

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  LaravelPagination
}
