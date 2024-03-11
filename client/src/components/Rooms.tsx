import { useContext } from "react";
import useRooms from "../hooks/useRooms";
import DataContext from "../context/dataContext";
import UserContext from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type CombinedData = {
  id: number;
  name: string;
  description: string;
  img: string;
  status?: string;
};

const Rooms = () => {
  const { loading, error, data: rooms } = useRooms();
  const navigate = useNavigate();
  const { userInfo, token } = useContext(UserContext);
  const isModerator = userInfo?.role === "moderator";
  const { userApplications, selectRoom, setUserApplicationsRefresh } =
    useContext(DataContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleRoomEntry = (roomId: number) => {
    selectRoom(roomId);
    navigate(`/room/${roomId}`);
  };

  const combinedData: CombinedData[] = rooms.map((room) => {
    if (!userApplications) return room;
    const application = userApplications.find((app) => app.roomId === room.id);
    if (application) {
      return { ...room, status: application.status };
    }
    return room;
  });

  const createApplication = async (roomId: number) => {
    try {
      await axios.post(
        `http://localhost:5000/api/applications`,
        {
          userId: userInfo.id,
          roomId,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      //refresh user applications
      setUserApplicationsRefresh(true);
    } catch (error) {
      console.error("Error accepting application:", error);
    }
  };

  const getButtonContent = (status: string, roomId: number) => {
    switch (status) {
      case "pending":
        return <button className="btn-pending">Pending</button>;
      case "rejected":
        return <button className="btn-rejected">Rejected</button>;
      case "accepted":
        return (
          <button className="btn-join" onClick={() => handleRoomEntry(roomId)}>
            Enter
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="room-card-container">
      {combinedData.map((room, index) => (
        <div className="room-card" key={index}>
          <img src={room.img} />
          <div className="room-card-info">
            <h2>{room.name}</h2>
            <p>{room.description}</p>
            {isModerator ? (
              <button
                className="btn-join"
                onClick={() => handleRoomEntry(room.id)}
              >
                Enter
              </button>
            ) : room.status ? (
              getButtonContent(room.status, room.id)
            ) : (
              <button
                className="btn-request"
                onClick={() => createApplication(room.id)}
              >
                Request Entry
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Rooms;
