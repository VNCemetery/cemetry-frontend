export default function NewsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center">News</h1>
      <p>
        This project uses React Query for fetching data. The news data is
        fetched from the <a href="https://newsapi.org/">News API</a> using the{" "}
        <a
          href="

            https://newsapi.org/docs/endpoints/everything"
        >
          /everything
        </a>{" "}
        endpoint.
      </p>
      <h2 className="text-xl font-bold">Features</h2>
      <ul>
        <li>Fetching data with React Query</li>
        <li>Displaying data with Mantine</li>
        <li>Responsive design with Tailwind CSS</li>
        <li>Dark mode with Mantine</li>
      </ul>
    </div>
  );
}
