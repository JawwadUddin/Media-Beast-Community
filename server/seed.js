const sqlite3 = require("sqlite3").verbose();

// Connect to the SQLite database file
const db = new sqlite3.Database("database.sqlite");

// Create tables
db.serialize(() => {
  // Create roles table
  db.run(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY,
      name TEXT
    )
  `);

  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      email TEXT,
      roleId INTEGER,
      FOREIGN KEY (roleId) REFERENCES roles(id)
    )
  `);

  // Create rooms table
  db.run(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY,
      name TEXT,
      description TEXT,
      img TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  //Create application_status table
  db.run(`
    CREATE TABLE IF NOT EXISTS application_status (
      id INTEGER PRIMARY KEY,
      status TEXT NOT NULL
    )
  `);

  // Create applications table
  db.run(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY,
      userId INTEGER,
      roomId INTEGER,
      statusId INTEGER,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (roomId) REFERENCES rooms(id),
      FOREIGN KEY (statusId) REFERENCES application_status(id)
    )
  `);

  console.log("Tables created successfully.");

  // Seed data
  const insertData = (tableName, data) => {
    const keys = Object.keys(data[0]);
    const placeholders = keys.map(() => "?").join(", ");
    const columns = keys.join(", ");

    data.forEach((obj) => {
      const values = Object.values(obj);
      db.run(
        `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`,
        ...values,
        (error) => {
          if (error) {
            console.error(
              `Error inserting data into ${tableName}:`,
              error.message
            );
          } else {
            console.log(`Data inserted into ${tableName} successfully.`);
          }
        }
      );
    });
  };

  // Define dummy data
  const rolesData = [{ name: "user" }, { name: "moderator" }];

  const usersData = [
    { email: "jawwaduddin54@gmail.com", roleId: 2 },
    { email: "jondoe@example.com", roleId: 1 },
    { email: "harry@outlook.com", roleId: 1 },
    { email: "mark@gmail.com", roleId: 1 },
  ];

  const roomsData = [
    {
      name: "We Are Unedited",
      description:
        "UNEDITED creates high-quality content that inspires and entertains. As an award-winning, Black-owned production company, we value authenticity and diversity. ",
      img: "https://weareunedited.com/wp-content/uploads/2023/03/Pilot-Season-Image-1678492835-1920x1000.png.webp",
    },
    {
      name: "8 Barrels Club",
      description:
        "At 8 Barrels Club, we come to work every day because we want to sell you the best and most unique spirits around.",
      img: "https://i0.wp.com/8barrelsclub.com/wp-content/uploads/2020/08/8barrels-sea-image-1596885870.jpg?resize=600%2C600&ssl=1",
    },
    {
      name: "GardenSpace360",
      description:
        "GardenSpace360 cover the design and build of your perfect Garden Space, with modern methods of construction; fast, clean and easy.",
      img: "https://gardenspace360.co.uk/wp-content/uploads/2020/07/GS2.jpg",
    },
    {
      name: "Jam 'N' Vegan",
      description:
        "Discover new flavours & culture from across the world with different meals each week. At Jam 'N' Vegan, our mission is to help you investigate cotinental flavours by bringing dishes directly to you.",
      img: "https://jamnvegan.com/wp-content/themes/jamnvegan/assets/img/vm-sticker-2.png",
    },
    {
      name: "SOGA",
      description:
        "Soga World are a leading WEB3 Creative & Management Agency bridging the gap between music, sport & the blockchain to create truly impactful cultural moments.",
      img: "https://soga.world/wp-content/uploads/2022/08/work-005.jpg",
    },
    {
      name: "Media Beast",
      description:
        "We help revolutionise businesses all over the world by providing key technical services including: design, branding, web development and app development.",
      img: "https://mediabeast.co.uk/assets/img/logo-icon.gif",
    },
  ];

  const applicationsData = [
    { userId: 3, roomId: 1, statusId: 1 },
    { userId: 2, roomId: 2, statusId: 1 },
    { userId: 3, roomId: 2, statusId: 1 },
    { userId: 4, roomId: 3, statusId: 1 },
    { userId: 2, roomId: 5, statusId: 1 },
  ];

  const applicationStatusData = [
    { status: "pending" },
    { status: "accepted" },
    { status: "rejected" },
  ];

  // Insert dummy data
  insertData("roles", rolesData);
  insertData("users", usersData);
  insertData("rooms", roomsData);
  insertData("application_status", applicationStatusData);
  insertData("applications", applicationsData);

  console.log("Dummy data inserted successfully.");

  const logTableData = (tableName) => {
    db.all(`SELECT * FROM ${tableName}`, (error, rows) => {
      if (error) {
        console.error(`Error querying data from ${tableName}:`, error.message);
      } else {
        console.log(`Data from ${tableName}:`, rows);
      }
    });
  };

  logTableData("roles");
  logTableData("users");
  logTableData("rooms");
  logTableData("applications");
  logTableData("application_status");
});

// Close the database connection
db.close();
