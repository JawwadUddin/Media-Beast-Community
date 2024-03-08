// import dummyData from "../data/dummyData.json";
import useRooms from "../hooks/useRooms";

type Rooms = {
  id: number;
  name: string;
  description: string;
  img: string;
};

const Rooms = () => {
  // const rooms: Rooms[] = dummyData;
  const { loading, error, data: rooms } = useRooms();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="room-card-container">
      {rooms.map((room, index) => (
        <div className="room-card" key={index}>
          <img src={room.img} />
          <div className="room-card-info">
            <h2>{room.name}</h2>
            <p>{room.description}</p>
            <button className="btn-secondary">Request Entry</button>
            {/* <button className="btn-primary">Enter Room</button> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Rooms;
