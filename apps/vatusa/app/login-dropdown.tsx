type LoginDropdownProps = {
  isLoggedIn: boolean;
  name?: string;
};

export default function LoginDropdown({
  isLoggedIn,
  name,
}: LoginDropdownProps) {
  if (!isLoggedIn) {
    return (
      <a
        className="bg-vatusaRed hover:bg-red-800 px-4 py-2 rounded-xl text-sm shadow-md"
        href="http://localhost:8000/cobalt/login"
      >
        Log In
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-white">{name}</span>
      <a
        className="bg-vatusaRed hover:bg-red-800 px-4 py-2 rounded-xl text-sm shadow-md"
        href="/auth/logout"
      >
        Log Out
      </a>
    </div>
  );
}
