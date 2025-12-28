# Emergency Dispatch Dashboard

AI-powered emergency dispatch system with real-time unit tracking and intelligent incident classification.

## Features

- 🗺️ **Interactive Map**: Real-time visualization of emergency units and incidents
- 🤖 **AI Classification**: Claude AI automatically classifies incident severity
- 📍 **Geospatial Queries**: Find nearest available units using MongoDB geospatial indexes
- 📊 **Performance Metrics**: Track response times and system efficiency
- 🚨 **Dispatch Management**: Assign units and resolve incidents with one click

## Tech Stack

- **Frontend**: React.js, Leaflet.js, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (with geospatial queries)
- **AI**: Anthropic Claude API

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Anthropic API key

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/emergency-dispatch.git
cd emergency-dispatch
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
ANTHROPIC_API_KEY=your_anthropic_api_key
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Generate Sample Data
```bash
cd backend
node utils/dataGenerator.js
```

## Running Locally

### Start Backend Server
```bash
cd backend
npm start
```

Server runs on `http://localhost:5000`

### Start Frontend

Open new terminal:
```bash
cd frontend
npm start
```

App opens on `http://localhost:3000`

## API Endpoints

### Incidents
- `GET /api/incidents` - Get all incidents
- `POST /api/incidents` - Create new incident (with AI classification)
- `GET /api/incidents/nearby?longitude=X&latitude=Y` - Get nearby incidents

### Units
- `GET /api/units` - Get all units
- `POST /api/units` - Create/update unit location
- `GET /api/units/nearest?longitude=X&latitude=Y&type=TYPE` - Find nearest units

### Dispatch
- `POST /api/dispatch/assign` - Assign unit to incident
- `POST /api/dispatch/resolve` - Mark incident as resolved
- `GET /api/dispatch/metrics` - Get performance metrics

## Deployment

### Deploy Backend to Render

1. Create account on [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**: Add `MONGODB_URI` and `ANTHROPIC_API_KEY`

### Deploy Frontend to Netlify

1. Create account on [Netlify.com](https://netlify.com)
2. Click "Add new site" → "Import existing project"
3. Connect your GitHub repo
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
   - **Environment Variable**: `REACT_APP_API_URL=your_backend_url`

## Usage

1. **View Map**: See all active incidents and unit locations
2. **Click Incident**: View AI analysis and severity classification
3. **Assign Unit**: Select nearest available unit and dispatch
4. **Monitor Metrics**: Track response times and system performance
5. **Resolve Incident**: Mark incident as complete when done

## Project Structure
```
emergency-dispatch/
├── backend/
│   ├── routes/          # API routes
│   ├── models/          # MongoDB schemas
│   ├── services/        # AI classification service
│   ├── utils/           # Data generator
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API client
│   │   └── App.js       # Main app
│   └── public/
└── README.md
```

## Demo

[Add screenshot or video here]

## License

MIT

## Author

Neha Erigidindla