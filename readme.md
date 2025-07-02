
# 📺 YouTube-Style Backend API

Backend server for a YouTube-like video-sharing application built with Node.js, Express, MongoDB, and JWT authentication.

---

## 🔧 Tech Stack

- **Node.js** & **Express.js** – Server & routing
- **MongoDB** + **Mongoose** – Data modeling
- **JWT** – Authentication
- **bcryptjs** – Password hashing
- **dotenv** – Environment variables
- **Cloudinary** – Image/video uploads
- **express-fileupload** – Form data handling

---

## 🚀 Project Structure

```

youtube\_backend/
├── Config/                # Cloudinary, DB configuration
├── controller/            # Route handlers
├── middleware/            # Authentication middleware
├── models/                # Mongoose schemas
├── routes/                # API routes
├── node\_modules/
├── tmp/                   # Temp upload folder for files
├── server.js              # Entry point
└── .env                   # Environment variables

````

---

## 🛠️ Setup & Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/Saumyasharma974/backend_projects.git
   cd backend_projects/youtube_backend
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` with:

   ```env
   PORT=5000
   MONGO_URI=<your MongoDB connection string>
   JWT_SECRET=<your JWT secret>
   CLOUDINARY_CLOUD_NAME=<cloud name>
   CLOUDINARY_API_KEY=<api key>
   CLOUDINARY_API_SECRET=<api secret>
   ```

4. Run the server:

   ```bash
   npm start
   ```

---

## 🔐 Authentication

Routes that require authentication use the `authMiddleware`, which checks for a valid JWT token passed in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## 📚 API Endpoints

### ✅ User & Channel Routes (`/api/user`)

| Method | Endpoint          | Description                                 |
| ------ | ----------------- | ------------------------------------------- |
| POST   | `/register`       | Register a new user                         |
| POST   | `/login`          | Log in and receive JWT                      |
| PUT    | `/update-profile` | Update profile (channel name, phone, photo) |
| POST   | `/subscribe`      | Subscribe to another user’s channel         |

---

### 🎥 Video Routes (`/api/video`)

| Method | Endpoint              | Description                           |
| ------ | --------------------- | ------------------------------------- |
| POST   | `/upload`             | Upload a video (auth)                 |
| PUT    | `/update/:id`         | Update video info (auth, owner only)  |
| DELETE | `/delete/:id`         | Delete video (auth, owner only)       |
| GET    | `/myvideo`            | Fetch videos uploaded by current user |
| GET    | `/allvideos`          | Fetch all videos (auth)               |
| GET    | `/tags/:tag`          | Fetch videos by tag                   |
| GET    | `/category/:category` | Fetch videos by category              |
| GET    | `/:id`                | Fetch single video by ID (auth)       |
| POST   | `/like`               | Like a video (auth)                   |
| POST   | `/dislike`            | Dislike a video (auth)                |

---

### 💬 Comment Routes (`/api/comment`)

| Method | Endpoint            | Description                           |
| ------ | ------------------- | ------------------------------------- |
| POST   | `/new`              | Add a comment to a video (auth)       |
| DELETE | `/:commentId`       | Delete your comment (auth)            |
| PUT    | `/:commentId`       | Update your comment (auth)            |
| GET    | `/comment/:videoId` | Fetch all comments for a video (auth) |

---

## ⛓️ Business Logic

* **Only video owners** can update or delete videos.
* **Only comment authors** can edit or delete their comments.
* **Subscribe** route prevents users from subscribing to themselves and manages subscription counts.

---

## ☁️ File Uploads

Profile pictures (`logoUrl`) are uploaded using Cloudinary. The API expects file uploads via form-data and stores only the URL and Cloudinary public ID in MongoDB.

---

## 🗂️ `.gitignore`

```gitignore
node_modules/
.env
tmp/
```

---

## 🛡️ Future Improvements

* Rate-limiting
* Pagination for videos & comments
* Email verification during registration
* Comment threading & likes/dislikes
* Analytics endpoints
* Integration with frontend

---

## 📝 Contributing

Contributions are welcome via PRs! Please open an issue first for major changes.

---

## 🧾 License

This project is licensed under **MIT License** — see the [LICENSE](LICENSE) file for details.

---

> Developed by **Saumya Sharma** – Enjoy building next-gen video-sharing experiences! 🎥🚀

```

---

Let me know if you'd like Swagger support or CI/CD workflow examples added!
::contentReference[oaicite:0]{index=0}
```
