

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
git : https://github.com/chaitanya12176/mern-agent-distributor-full.git
```

### 2️⃣ Install dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd clent
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file inside `backend/` with the following:

```

MONGO_URI=mongodb://127.0.0.1:27017/agent_distributor
PORT=5000
JWT_SECRET=supersecretjwtkey_change_me


```

### 4️⃣ Run the application

#### Start Backend

```bash
cd server
npm run dev
```

#### Start Frontend

```bash
cd client
npm start
```

### 5️⃣ Open in Browser

Frontend: `http://localhost:3000`
Backend: `http://localhost:5000`

---

## 🎥 Demonstration

📌google drive link: https://drive.google.com/file/d/1pIzl3T5Bl9fnHfA78v_q2Bgha-8XT0Xe/view?usp=sharing

---

## ✅ Evaluation Criteria Coverage

* **Functionality**: Implements all required features
* **Code Quality**: Clean, modular, and well-commented
* **Validation & Error Handling**: Covers invalid login, invalid CSV formats, missing fields
* **User Interface**: Simple and user-friendly
* **Execution**: Easy to run using `npm install` and `.env`

---


