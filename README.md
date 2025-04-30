# Cardano-Explorer-Upgrade-Advanced-Analytics-Visualization

# Cardano Blockchain Visualizer

## Overview
This project is a **comprehensive and advanced Cardano blockchain visualizer**. It provides insights into token distribution, transaction activity, and active accounts using data from the **AdaStat API**. The system consists of a **backend** (Node.js with Express) and a **frontend** (React with Tailwind CSS and DaisyUI).

## Technologies Used
### Backend
- **Node.js & Express.js** – Server-side logic
- **Axios** – API requests
- **http-proxy-middleware** – Reverse proxy for AdaStat API

### Frontend
- **React.js** – UI framework
- **Tailwind CSS** – Styling
- **DaisyUI** – UI components
- **Axios** – API requests

---

## Backend

### Features
- **Reverse Proxy**: Routes requests through `https://api.adastat.net/`
- **Token Distribution Analysis**: Fetches token data and calculates:
  - Average supply per holder
  - Top holders
  - Daily transaction rate
  - Transactions per second
- **Transaction Monitoring**:
  - Calculates transactions per minute in the last hour
- **Active Accounts Tracker**:
  - Fetches active accounts from the last 100 epochs

### API Endpoints

#### 1. Reverse Proxy
- **Route:** `/*`
- **Method:** `GET`
- **Description:** Forwards all requests to the AdaStat API.

#### 2. Token Distribution
- **Route:** `/token-distribution`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "tokenName": "TOKEN_NAME",
    "policyId": "POLICY_ID"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "averageSupply": NUMBER,
      "topHolders": ARRAY,
      "dailyTransactionRate": NUMBER,
      "transactionPerSecond": NUMBER,
      "averageTransactionPerHolder": NUMBER
    }
  }
  ```

#### 3. Daily Transaction Stats
- **Route:** `/daily-stats`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "status": "success",
    "data": { "transactionsPerMinute": ARRAY }
  }
  ```

#### 4. Active Accounts
- **Route:** `/active-accounts`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "status": "success",
    "data": [{ "epoch": NUMBER, "activeAccounts": NUMBER }]
  }
  ```
### Environment Variables
Backend (.env file):
```
PORT=<the port number you want to use>
```

### How to Start Backend
1. Clone the repository:
   ```bash
   git clone https://github.com/eyasubirhanu/Cardano-Smart-Contract-Libraries.git
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start:dev (for development)
   npm start:prod (for production)
   ```

---

## Frontend

### Features
- **Real-time Blockchain Data**: Visualizes token distribution, transactions, and active accounts
- **Interactive Charts**: Displays statistics dynamically
- **Responsive Design**: Works on desktop and mobile

### How to Start Frontend
1. Navigate to the frontend directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm run dev
   ```

---
## Important links:
* Documentation and gudline: https://docs.google.com/document/d/1BemfwvDyXIcgH_H2TouPghTSJpm6F4FBc9umC38rJT0/edit?usp=sharing


