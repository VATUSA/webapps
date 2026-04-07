"use client"

import * as React from "react"
import { useFormStatus } from "react-dom"
import { Loader2Icon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

type FormSaveButtonProps = React.ComponentProps<typeof Button> & {
  pendingText?: React.ReactNode
  showSpinner?: boolean
}

export function FormSaveButton({
  children,
  pendingText = "Saving...",
  showSpinner = true,
  className,
  disabled,
  ...props
}: FormSaveButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending}
      className={cn("gap-1.5", className)}
      {...props}
    >
      {pending && showSpinner ? (
        <Loader2Icon className="size-4 animate-spin" />
      ) : null}
      <span>{pending ? pendingText : children}</span>
    </Button>
  )
}
