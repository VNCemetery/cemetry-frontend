import { Link } from "react-router";

export default function MapPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center">Map</h1>
      <p>
        This project uses Leaflet for mapping. The main layout is defined in{" "}
        <code>src/App.jsx</code> and the map is defined in{" "}
        <code>src/components/page</code> and <code>src/components/layout</code>.
      </p>
      <h2 className="text-xl font-bold">Map</h2>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/admin">Admin</Link>
        </li>
      </ul>
    </div>
  );
}
