import dummyData from "../data/dummyData.json";
import { FaLock } from "react-icons/fa";

type Rooms = {
  id: number;
  name: string;
  description: string;
  img: string;
};

const Sidebar = () => {
  const rooms: Rooms[] = dummyData;

  return (
    <div className="sidebar-container">
      <h2>Rooms</h2>
      <ul className="sidebar-items">
        <li className="selected">All</li>
        {rooms.map((room) => (
          <li>
            <span>{room.name}</span>
            <FaLock size={12} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
