"use client"

import * as React from "react"
import { toast } from "sonner"

type DeletePolicyCategoryButtonProps = {
  itemTitle?: string
  disabled?: boolean
  disabledReason?: string
}

export default function DeletePolicyCategoryButton({
  itemTitle,
  disabled,
  disabledReason,
}: DeletePolicyCategoryButtonProps) {
  const [isConfirming, setIsConfirming] = React.useState(false)

  React.useEffect(() => {
    if (!isConfirming) return

    const timeout = window.setTimeout(() => {
      setIsConfirming(false)
    }, 4000)

    return () => window.clearTimeout(timeout)
  }, [isConfirming])

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (disabled) {
      event.preventDefault()
      if (disabledReason) toast.warning(disabledReason)
      return
    }

    if (isConfirming) return

    event.preventDefault()
    setIsConfirming(true)

    toast.warning("Click again to confirm delete.", {
      description: itemTitle
        ? `This will permanently delete "${itemTitle}".`
        : "This will permanently delete this category.",
    })
  }

  return (
    <button
      type="submit"
      onClick={handleClick}
      aria-pressed={isConfirming}
      aria-disabled={disabled}
      title={disabled ? disabledReason : undefined}
      className={
        disabled
          ? "inline-flex h-8 cursor-not-allowed items-center justify-center rounded-md border border-border/60 bg-muted/40 px-3 text-sm font-medium whitespace-nowrap text-muted-foreground"
          : isConfirming
            ? "inline-flex h-8 items-center justify-center rounded-md border border-destructive bg-destructive px-3 text-sm font-medium whitespace-nowrap text-destructive-foreground shadow-sm ring-2 ring-destructive/40 transition-colors hover:bg-destructive/90"
            : "inline-flex h-8 items-center justify-center rounded-md border border-destructive/30 bg-background px-3 text-sm font-medium whitespace-nowrap text-destructive shadow-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
      }
    >
      {isConfirming && !disabled ? "Confirm Delete" : "Delete"}
    </button>
  )
}
