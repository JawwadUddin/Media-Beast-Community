import { useContext } from "react";
import dummyData from "../data/dummyData.json";
import { FaLock } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import UserContext from "../context/userContext";
import DataContext from "../context/dataContext";

type Rooms = {
  id: number;
  name: string;
  description: string;
  img: string;
};

const Sidebar = () => {
  const rooms: Rooms[] = dummyData;
  const { userInfo } = useContext(UserContext);
  const { applications } = useContext(DataContext);

  return (
    <div className="sidebar-container">
      <h2>Rooms</h2>
      <ul className="sidebar-items">
        <li className="selected">All</li>
        {rooms.map((room) => (
          <li key={room.id}>
            <span>{room.name}</span>
            {userInfo?.moderator === "moderator" && <FaLock size={12} />}
          </li>
        ))}
      </ul>
      {/* only moderators should see below */}
      {userInfo?.role === "moderator" && (
        <>
          <h2>Requests</h2>
          <ul className="sidebar-requests">
            {applications?.map((application) => (
              <li>
                <h3>{application.email}</h3>
              </li>
            ))}
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
        </>
      )}
    </div>
  );
};

export default Sidebar;
