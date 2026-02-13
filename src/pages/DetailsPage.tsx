import { Link } from "react-router-dom";
export default function DetailsPage() {
  return (
    <div className="details-page">
      <h1>Details Page</h1>
      <p>This page will display detailed information about a specific item.</p>
      <Link to="/" style={{ marginTop: "20px", textDecoration: "none" }}>
        Home
      </Link>
    </div>
  );
}
