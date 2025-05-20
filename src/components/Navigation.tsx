import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="w-full bg-gray-100 p-4 shadow-md">
      <ul className="flex space-x-4 justify-center">
        <li>
          <Button variant="ghost" asChild>
            <Link to="/inventory">Inventory</Link>
          </Button>
        </li>
        <li>
          <Button variant="ghost" asChild>
            <Link to="/needs">Needs</Link>
          </Button>
        </li>
        <li>
          <Button variant="ghost" asChild>
            <Link to="/ideas">Ideas</Link>
          </Button>
        </li>
        <li>
          <Button variant="ghost" asChild>
            <Link to="/budget">Budget</Link>
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;