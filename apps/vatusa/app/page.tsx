export default function Home() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-semibold  text-black dark:text-zinc-50 py-5">
        Homepage
      </h1>

      <section className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-300">
          Disclaimer
        </h3>
        <p className="text-sm text-yellow-900 dark:text-yellow-200 leading-relaxed">
          VATUSA is the United States Division of the VATSIM network. This
          website and organization are not affiliated with the Federal Aviation
          Administration (FAA) or any real-world government agency. All air
          traffic control services are provided in a simulated environment.
        </p>
      </section>
    </div>
  );
}
