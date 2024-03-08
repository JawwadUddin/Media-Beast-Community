import dummyData from "../data/dummyData.json";

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
          <li>{room.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
