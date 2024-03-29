# Media-Beast-Community

Media Beast Community is a web application for building a community around media-related topics. It provides features for authentication, authorization, and role-based access control (RBAC) using Clerk for authentication and JWT tokens for authorization.

## Getting Started

### Clone the Repository

```
git clone https://github.com/JawwadUddin/Media-Beast-Community.git
```

### Server Setup

1. Navigate to the `server` directory:

```bash
cd server
```

2. Create a `.env` file at the root of the server directory:

```
PORT=5000
JWT_SECRET=<your-jwt-secret>
```

3. Install dependencies:

```bash
npm install
```

4. Open the `seed.js` file and update the email in line 90 to your own email for moderator access. (You can use 2 email accouts, one to view the application as a user and the other as a moderator.)

5. Seed the database:

```bash
node seed.js
```

6. Start the server:

```bash
npm start
```

If successful, you should see a message indicating that the server is running on port 5000.

### Client Setup

1. Navigate to the `client` directory:

```bash
cd client
```

2. Create a `.env.local` file with your Clerk publishable key:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_d2lubmluZy1tYXJsaW4tMjguY2xlcmsuYWNjb3VudHMuZGV2JA
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

## Key Features

- Authentication using Clerk
- Authorization using JWT tokens
- Role-Based Access Control (RBAC) with moderator and user roles
- Custom CSS for UI styling
- Client and Server side protected routes

### Future Improvements

- **Enhanced User Profiles:** Implement user profiles with additional information and customization options.
- **Real-Time Updates:** Integrate real-time updates for notifications and chat functionality.
- **Content Recommendations:** Add a recommendation system for personalized content suggestions.
- **Community Features:** Expand community features such as forums, groups, and events.
- **Mobile App:** Develop a companion mobile app for on-the-go access to the community.
- **Accessibility Improvements:** Ensure accessibility compliance for users with disabilities.
- **Performance Optimization:** Optimize performance for faster load times and smoother user experience.
- **Localization:** Provide multi-language support to cater to a global audience.
- **Security Enhancements:** Implement additional security measures to protect user data and prevent unauthorized access.

These improvements can enhance the functionality, usability, and scalability of the Media Beast Community platform.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.
