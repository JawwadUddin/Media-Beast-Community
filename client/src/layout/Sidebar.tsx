import { useContext } from "react";
import { FaLock } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import UserContext from "../context/userContext";
import DataContext from "../context/dataContext";
import useRooms from "../hooks/useRooms";
import { useNavigate } from "react-router-dom";
import { useMatch } from "react-router-dom";

const Sidebar = () => {
  const { userInfo } = useContext(UserContext);
  const { applications, selectedRoom, selectRoom } = useContext(DataContext);
  const { loading, error, data: rooms } = useRooms();
  const navigate = useNavigate();
  const isOnRootRoute = useMatch("/");

  const handleClick = (roomId: number) => {
    selectRoom(roomId);
    navigate(`/room/${roomId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="sidebar-container">
      <h2>Rooms</h2>
      <ul className="sidebar-items">
        <li
          className={isOnRootRoute ? "selected" : ""}
          onClick={() => {
            selectRoom(null);
            navigate("/");
          }}
        >
          All
        </li>
        {rooms.map((room) => (
          <li
            className={
              selectedRoom ? (room.id === selectedRoom ? "selected" : "") : ""
            }
            key={room.id}
            onClick={() => handleClick(room.id)}
          >
            <span>{room.name}</span>
            {userInfo?.role !== "moderator" && <FaLock size={12} />}
          </li>
        ))}
      </ul>
      {/* only moderators should see below */}
      {userInfo?.role === "moderator" && (
        <>
          <h2>Requests</h2>
          <ul className="sidebar-requests">
            {rooms.map((room) => (
              <li key={room.id}>
                <h3>{room.name}</h3>
                <ul>
                  {applications?.filter(
                    (application) => application.roomId === room.id
                  ).length === 0 ? (
                    <li>No pending requests</li>
                  ) : (
                    applications
                      ?.filter((application) => application.roomId === room.id)
                      .map((application) => (
                        <li key={application.id}>
                          {application.email}
                          <div className="requests">
                            <IoClose
                              cursor="pointer"
                              size={20}
                              color="#ff0000c7"
                            />
                            <IoMdCheckmark
                              cursor="pointer"
                              size={20}
                              color="rgb(17, 167, 165)"
                            />
                          </div>
                        </li>
                      ))
                  )}
                </ul>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Sidebar;
