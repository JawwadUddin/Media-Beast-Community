import { useParams } from "react-router-dom";
import useRooms from "../hooks/useRooms";

const Room = () => {
  const { roomId } = useParams();
  if (!roomId) return null;
  const { data: rooms } = useRooms();

  return (
    <div>
      You now have access to the information in room{" "}
      {rooms.find((room) => parseInt(roomId) === room.id)?.name}
    </div>
  );
};

export default Room;
