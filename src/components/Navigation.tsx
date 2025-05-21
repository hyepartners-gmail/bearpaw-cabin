import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="w-full bg-gray-100 p-4 shadow-md">
      <ul className="flex flex-wrap justify-center gap-2 md:gap-4">
        <li>
          <Button variant="ghost" asChild className="lg:text-lg">
            <Link to="/inventory">Inventory</Link>
          </Button>
        </li>
        <li>
          <Button variant="ghost" asChild className="lg:text-lg">
            <Link to="/tools">Tools</Link>
          </Button>
        </li>
        <li>
          <Button variant="ghost" asChild className="lg:text-lg">
            <Link to="/movies-games">Movies & Games</Link>
          </Button>
        </li>
        <li>
          <Button variant="ghost" asChild className="lg:text-lg">
            <Link to="/ideas">Ideas</Link>
          </Button>
        </li>
        <li>
          <Button variant="ghost" asChild className="lg:text-lg">
            <Link to="/needs">Needs</Link>
          </Button>
        </li>
        <li>
          <Button variant="ghost" asChild className="lg:text-lg">
            <Link to="/budget">Budget</Link>
          </Button>
        </li>
         <li>
          <Button variant="ghost" asChild className="lg:text-lg">
            <Link to="/projections">Projections</Link>
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;