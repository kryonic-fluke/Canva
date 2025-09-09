# Synapse Workspace

### [**Live Demo »**](https://synapse-workspace.netlify.app)

Synapse is a real-time, collaborative visual workspace designed to transform scattered ideas into structured plans. It's a free-form canvas supercharged with an AI-powered "Intelligence Suite" to provide deep project insights and analysis.

![Synapse Demo GIF](https://YOUR_LINK_TO_A_DEMO_GIF_OR_SCREENSHOT.gif)

## Key Features

*   **⚡ Real-Time Collaboration:** All actions (creating, updating, deleting nodes and edges) are synchronized instantly across all connected users using Firestore.
*   **✍️ Multiple Node Types:** Go beyond simple text with specialized nodes for Checklists, Sticky Notes, and Images.
*   **🔗 Visual Connections:** Create edges between nodes to map out workflows, dependencies, and relationships.
*   **🔒 Secure Invite System:** Share your canvases with collaborators using a secure, request-based access system.

### 🧠 Intelligence Suite
*   **Magic Tagger (AI):** Automatically categorize selected nodes using a Hugging Face Zero-Shot classification model to bring order to your ideas.
*   **Snapshot Dashboard:** An interactive sidebar that visualizes canvas statistics (breakdowns by category, type, and progress) using `recharts`.
*   **Project Analyst (AI):** Get a high-level summary, identify potential risks, and receive actionable suggestions for your project, powered by Google Gemini.

## Tech Stack

| Category      | Technology                                                              |
|---------------|-------------------------------------------------------------------------|
| **Frontend**  | React, TypeScript, Vite, Reactflow, TanStack Query, Recharts, Tailwind CSS |
| **Backend**   | Node.js, Express, TypeScript                                            |
| **Databases** | **MongoDB** (Permissions & Metadata), **Firestore** (Real-Time State)      |
| **AI Services** | Hugging Face (Classification), Google Gemini (Analysis)                 |
| **Auth**      | Firebase Authentication                                                 |
| **Deployment**| Netlify (Client), Serverless Functions                                  |

## Local Development Setup

This project is configured as a monorepo using NPM Workspaces.

#### 1. Clone the repository
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

#### 2. Environment Variables
You will need to create two environment files.

*   In the `/client` directory, create a file named `.env.development`:
    ```env
    # /client/.env.development
    VITE_API_URL=http://localhost:5001
    VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
    VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
    VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
    VITE_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
    VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
    VITE_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
    ```
*   In the `/server` directory, create a file named `.env`:
    ```env
    # /server/.env
    PORT=5001
    MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
    FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./path/to/your/serviceAccountKey.json
    ```

#### 3. Install Dependencies
Install all dependencies for both the client and server from the root directory.
```bash
npm install
```

#### 4. Run the Application
Run the client and server concurrently from the root directory.
```bash
npm run dev
```
The client will be available at `http://localhost:5174` and the server at `http://localhost:5001`.

## Project Structure

The project is organized as a monorepo to separate frontend and backend concerns while maintaining a single repository.

```
/
├── client/     # React (Vite) frontend application
├── server/     # Node.js (Express) backend server
└── ...         # Root configuration files
```

## License
This project is licensed under the MIT License.