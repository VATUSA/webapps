"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"

type SelectFieldOption = {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

type SelectFieldProps = {
  id?: string
  name?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  ariaLabel?: string
  className?: string
  triggerClassName?: string
  contentClassName?: string
  options: SelectFieldOption[]
}

export function SelectField({
  id,
  name,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  required = false,
  disabled = false,
  ariaLabel,
  className,
  triggerClassName,
  contentClassName,
  options,
}: SelectFieldProps) {
  const isControlled = value !== undefined

  return (
    <Select
      id={id}
      name={name}
      value={isControlled ? value : undefined}
      defaultValue={!isControlled ? defaultValue : undefined}
      onValueChange={(nextValue) => {
        onValueChange?.(nextValue ?? "")
      }}
      required={required}
      disabled={disabled}
    >
      <div className={cn("w-full", className)}>
        <SelectTrigger
          aria-label={ariaLabel}
          className={cn("w-full", triggerClassName)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </div>

      <SelectContent className={contentClassName}>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export type { SelectFieldOption, SelectFieldProps }
