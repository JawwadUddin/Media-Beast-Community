import { useContext } from "react";
import { FaLock } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import UserContext from "../context/userContext";
import DataContext from "../context/dataContext";
import useRooms from "../hooks/useRooms";
import { useNavigate } from "react-router-dom";
import { useMatch } from "react-router-dom";
import axios from "axios";

type CombinedData = {
  id: number;
  name: string;
  description: string;
  img: string;
  unlocked?: boolean;
};

const Sidebar = () => {
  const { userInfo } = useContext(UserContext);
  const {
    applications,
    selectedRoom,
    selectRoom,
    setRefresh,
    userApplications,
  } = useContext(DataContext);
  const { loading, error, data: rooms } = useRooms();
  const navigate = useNavigate();
  const isOnRootRoute = useMatch("/");

  const combinedData: CombinedData[] = rooms.map((room) => {
    if (!userApplications) return room;
    const application = userApplications.find((app) => app.roomId === room.id);
    if (application?.status === "accepted") {
      return { ...room, unlocked: true };
    }
    return { ...room };
  });

  const roomsWithApplications = rooms.filter((room) =>
    applications?.some((application) => application.roomId === room.id)
  );

  const requestData = roomsWithApplications.map((room) => ({
    name: room.name,
    id: room.id,
    applications: applications?.filter(
      (application) => application.roomId === room.id
    ),
  }));

  const acceptApplication = async (applicationId: number) => {
    try {
      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/update`,
        {
          applicationStatus: "accepted",
        }
      );
      setRefresh(true);
    } catch (error) {
      console.error("Error accepting application:", error);
    }
  };
  const rejectApplication = async (applicationId: number) => {
    try {
      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/update`,
        {
          applicationStatus: "rejected",
        }
      );
      setRefresh(true);
    } catch (error) {
      console.error("Error accepting application:", error);
    }
  };

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
        {combinedData.map((room) => (
          <li
            className={
              selectedRoom ? (room.id === selectedRoom ? "selected" : "") : ""
            }
            key={room.id}
            onClick={() => handleClick(room.id)}
          >
            <span>{room.name}</span>
            {userInfo?.role !== "moderator" && !room.unlocked && (
              <FaLock size={12} />
            )}
          </li>
        ))}
      </ul>
      {/* only moderators should see below */}
      {userInfo?.role === "moderator" && (
        <>
          <h2>Requests</h2>
          <ul className="sidebar-requests">
            {requestData.length === 0 ? (
              <ul>
                <li>No requests</li>
              </ul>
            ) : (
              requestData.map((room) => (
                <li key={room.id}>
                  <h3>{room.name}</h3>
                  <ul>
                    {room.applications?.map((application) => (
                      <li key={application.id}>
                        {application.email}
                        <div className="requests">
                          <IoClose
                            cursor="pointer"
                            size={20}
                            color="#ff0000c7"
                            onClick={() => rejectApplication(application.id)}
                          />
                          <IoMdCheckmark
                            cursor="pointer"
                            size={20}
                            color="rgb(17, 167, 165)"
                            onClick={() => acceptApplication(application.id)}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default Sidebar;
