export function requireStaffSession(
  session: { is_staff?: boolean } | null | undefined
): boolean {
  return session?.is_staff ?? false
}
