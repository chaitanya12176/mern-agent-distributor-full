Perfect 👍
Here’s a **sample README** tailored to your MERN Stack Machine Test. You can edit project name, video link, and add extra details as needed.

---

# MERN Stack Machine Test – Admin, Agents & CSV Distribution

## 📌 Objective

A MERN stack application that includes:

1. **Admin User Login** (with JWT authentication)
2. **Agent Creation & Management**
3. **Upload CSV/XLSX & Distribute Lists among Agents**

---

## 🚀 Features

* **Admin Login** using JWT authentication
* **Add Agents** (Name, Email, Mobile Number, Password)
* **Upload CSV/XLSX File** containing FirstName, Phone, Notes
* **Validation**: Only `.csv`, `.xlsx`, `.xls` accepted
* **Auto Distribution**: Tasks are equally distributed among 5 agents
* **Remainder Distribution**: If not divisible, remaining items assigned sequentially
* **Data Stored** in MongoDB
* **Frontend Dashboard** to view distributed tasks per agent

---

## 🛠 Tech Stack

* **Frontend**: React.js
* **Backend**: Node.js + Express.js
* **Database**: MongoDB (Mongoose ODM)
* **Authentication**: JSON Web Tokens (JWT)
* **File Upload & Parsing**: Multer, XLSX, CSV Parser

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone <your-repo-link>
cd <project-folder>
```

### 2️⃣ Install dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file inside `backend/` with the following:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 4️⃣ Run the application

#### Start Backend

```bash
cd backend
npm run dev
```

#### Start Frontend

```bash
cd frontend
npm start
```

### 5️⃣ Open in Browser

Frontend: `http://localhost:3000`
Backend: `http://localhost:5000`

---

## 🎥 Demonstration

📌 [Google Drive Video Link](https://drive.google.com/) *(Replace with your link)*

---

## ✅ Evaluation Criteria Coverage

* **Functionality**: Implements all required features
* **Code Quality**: Clean, modular, and well-commented
* **Validation & Error Handling**: Covers invalid login, invalid CSV formats, missing fields
* **User Interface**: Simple and user-friendly
* **Execution**: Easy to run using `npm install` and `.env`

---

👉 This format will make your submission **clear and professional**.

Do you want me to also **add example screenshots** section in the README (with placeholders), so you can easily insert them after recording?
