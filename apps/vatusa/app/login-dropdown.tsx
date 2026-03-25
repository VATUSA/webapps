type LoginDropdownProps = {
  isLoggedIn: boolean
  name?: string
}

export default function LoginDropdown({
  isLoggedIn,
  name,
}: LoginDropdownProps) {
  if (!isLoggedIn) {
    return (
      <a
        className="bg-vatusaRed rounded-xl px-4 py-2 text-sm shadow-md hover:bg-red-800"
        href="http://localhost:8000/cobalt/login"
      >
        Log In
      </a>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-white">{name}</span>
      <a
        className="bg-vatusaRed rounded-xl px-4 py-2 text-sm shadow-md hover:bg-red-800"
        href="/auth/logout"
      >
        Log Out
      </a>
    </div>
  )
}
