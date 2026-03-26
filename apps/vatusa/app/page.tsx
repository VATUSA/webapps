export default function Page() {
  return (
    <div className="container mx-auto">
      <h1 className="py-5 text-3xl font-semibold text-black dark:text-zinc-50">
        Homepage
      </h1>

      <section className="rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-6 shadow-sm dark:bg-yellow-900/20">
        <h3 className="mb-2 font-semibold text-yellow-800 dark:text-yellow-300">
          Disclaimer
        </h3>
        <p className="text-sm leading-relaxed text-yellow-900 dark:text-yellow-200">
          VATUSA is the United States Division of the VATSIM network. This
          website and organization are not affiliated with the Federal Aviation
          Administration (FAA) or any real-world government agency. All air
          traffic control services are provided in a simulated environment.
        </p>
      </section>
    </div>
  )
}
