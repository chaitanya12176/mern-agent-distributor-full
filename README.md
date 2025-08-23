# MERN Agent Distributor (No Vite)

## Prerequisites
- Node 18+
- MongoDB running locally or Atlas

## Backend
```bash
cd server
cp .env.example .env   # edit values if needed
npm install
npm run seed:admin     # creates admin@example.com / Admin@123
npm run dev            # http://localhost:5000
```

## Frontend (Create React App)
```bash
cd client
cp .env.example .env   # REACT_APP_API_URL=http://localhost:5000/api
npm install
npm start              # http://localhost:3000
```

## Use
1. Login as admin@example.com / Admin@123
2. Create at least 5 agents (Name, Email, Mobile with country code, Password).
3. Upload .csv / .xls / .xlsx / .axls with headers: FirstName, Phone, Notes.
4. Distribution is round-robin across 5 earliest agents.
5. View distribution per agent on the Upload page.
