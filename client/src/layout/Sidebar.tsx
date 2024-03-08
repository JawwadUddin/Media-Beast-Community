import dummyData from "../data/dummyData.json";
import { FaLock } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { IoClose } from "react-icons/io5";

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
          <li key={room.id}>
            <span>{room.name}</span>
            <FaLock size={12} />
          </li>
        ))}
      </ul>
      {/* only moderators should see below */}
      <h2>Requests</h2>
      <ul className="sidebar-requests">
        <li>
          <h3>Room 1</h3>
          <ul>
            <li>
              Jonathon
              <div className="requests">
                <IoClose cursor="pointer" size={20} color="#ff0000c7" />
                <IoMdCheckmark
                  cursor="pointer"
                  size={20}
                  color="rgb(17, 167, 165)"
                />
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
