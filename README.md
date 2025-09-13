# 🧠 Synapse
### AI-Powered Visual Collaboration Workspace

> **Transform scattered ideas into structured, collaborative plans with real-time intelligence**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)](https://firebase.google.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)

---

## 🎯 **Project Overview**

Synapse is a cutting-edge visual workspace application designed to solve the fundamental problem of **"organizing the chaos of creativity."** Built for individuals and teams who need to transform scattered ideas into structured, actionable plans, Synapse combines real-time collaboration with AI-powered intelligence to deliver unprecedented project insights and organization capabilities.

### **🚀 Key Problem Solved**
- **Before Synapse**: Ideas scattered across multiple tools, poor collaboration, lack of project intelligence
- **After Synapse**: Unified visual workspace with real-time collaboration and AI-driven project analysis

---

## ✨ **Core Features**

### **🎨 Visual Collaboration Engine**
- **Infinite Zoomable Canvas**: Unlimited workspace with persistent nodes and edges
- **Real-Time Synchronization**: Instant CRUD operations via Firestore with live user presence
- **Multiple Node Types**: Text blocks, checklists, sticky notes, and image nodes
- **Secure Sharing System**: Invite-based collaboration with comprehensive permission management

### **🤖 Intelligence Suite (AI-Powered)**
- **Magic Tagger**: Automated node categorization using Hugging Face ML models
- **Snapshot Dashboard**: Interactive analytics with dynamic charts and canvas statistics
- **AI Project Analyst**: Google Gemini-powered co-pilot providing project summaries, risk analysis, and actionable recommendations

---

## 🏗️ **Technical Architecture**

### **Full-Stack TypeScript Monorepo**
```
synapse-monorepo/
├── client/          # React + TypeScript frontend
├── server/          # Express + TypeScript backend
└── netlify.toml     # Serverless deployment configuration
```

### **Frontend Stack**
- **Framework**: React 19 with TypeScript, built with Vite
- **UI Libraries**: ReactFlow (canvas), Recharts (analytics), Tailwind CSS
- **State Management**: Custom React hooks, TanStack Query, React Context
- **Authentication**: Firebase Authentication SDK

### **Backend Stack**
- **Runtime**: Node.js with Express, serverless-compatible architecture
- **Authentication**: Firebase Admin SDK for secure token verification
- **API Design**: RESTful endpoints with custom controllers and services
- **Deployment**: Netlify Functions for serverless execution

### **Database Strategy**
- **MongoDB**: Primary database for permissions, metadata, and core application data
- **Google Firestore**: Real-time collaborative state engine for live synchronization
- **Dual Database Architecture**: Optimized for both persistence and real-time performance

---

## 🛠️ **Technology Stack**

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | React 19, TypeScript, Vite | Modern UI development |
| **Backend** | Node.js, Express, TypeScript | API and business logic |
| **Real-time** | Google Firestore | Live collaboration |
| **Database** | MongoDB | Data persistence |
| **Authentication** | Firebase Auth | Secure user management |
| **AI/ML** | Hugging Face, Google Gemini | Intelligence features |
| **Visualization** | ReactFlow, Recharts | Canvas and analytics |
| **Styling** | Tailwind CSS | Responsive design |
| **Deployment** | Netlify Functions | Serverless hosting |
| **State Management** | TanStack Query, React Context | Client-side state |

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ and npm
- MongoDB instance
- Firebase project with Authentication and Firestore
- Google Gemini API key
- Hugging Face API access

### **Quick Start**

1. **Clone and Install**
   ```bash
   git clone https://github.com/yourusername/synapse
   cd synapse
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Client environment
   cp client/.env.example client/.env
   
   # Server environment
   cp server/.env.example server/.env
   ```

3. **Development Mode**
   ```bash
   # Start both client and server
   npm run dev
   
   # Or individually
   npm run dev:client
   npm run dev:server
   ```

4. **Production Build**
   ```bash
   npm run build
   ```

---

## 📱 **Features Showcase**

### **🏠 Professional Landing & Dashboard**
<img src="docs/images/landing-page.png" alt="Synapse Landing Page" width="800">

*Clean, professional interface with intuitive navigation and canvas management*

### **📋 Canvas Management & Sharing**
<img src="docs/images/canvas-sidebar-share.png" alt="Canvas Sidebar with Share Options" width="600">

*Organized canvas sidebar with dropdown sharing controls and delete options*

### **👥 Secure Collaboration System**
<img src="docs/images/join-notification.png" alt="Collaboration Request Notification" width="500">

*Smart notification system showing user details (name, email) with accept/decline options*

### **🎨 Multi-Modal Node Creation**
<img src="docs/images/node-types-showcase.png" alt="All Node Types on Canvas" width="800">

*Comprehensive node system: Text, Checklists, Sticky Notes, and Image nodes with creation dropdown*

### **🤖 AI-Powered Smart Categorization**
<img src="docs/images/ai-categorization-demo.gif" alt="AI Magic Tagger Demo" width="700">

*Watch AI automatically categorize and tag nodes based on content analysis*

### **📊 Intelligence Suite - Analytics Dashboard**

#### **Snapshot Overview**
<img src="docs/images/snapshot-sidebar-pie.png" alt="Snapshot Pie Chart Analytics" width="400">

*Real-time pie chart showing distribution of categorized nodes*

#### **Checklist Analytics**
![Checklist Analytics Demo](docs/videos/checklist-analytics-demo.gif)

*Interactive bar graphs showing:*
- *Overall completion rates across all checklist nodes*
- *Individual checklist breakdown with complete/incomplete tasks*

### **🧠 AI Project Analyst**
<img src="docs/images/ai-analysis-output.png" alt="AI Generated Project Analysis" width="600">

*Google Gemini-powered insights providing project summaries, risk analysis, and actionable recommendations*

---

## 🎬 **Complete Workflow Demonstration**

*Experience the full collaborative journey from canvas creation to real-time editing*

### **1️⃣ Canvas Creation & Sharing**
![Canvas Creation and Sharing](docs/gifs/create.gif)

**Step 1:** *Create new canvas → Add initial content nodes → Open share dropdown → Generate secure invite link*

### **2️⃣ Secure Invitation System**
![Collaboration Request](docs/gifs/request.gif)

**Step 2:** *Share invite link → Access request notification → User authentication and permission request*

### **3️⃣ Smart Access Control**
![Accept/Decline Requests](docs/gifs/accept.gif)

**Step 3:** *Review collaboration requests → User details verification → Accept or decline access permissions*

### **4️⃣ Seamless Canvas Access**
![Canvas Reload After Access](docs/gifs/reload-vid.gif)

**Step 4:** *Instant canvas synchronization → Real-time data loading → Ready for collaborative editing*

### **5️⃣ Real-Time Collaboration Engine**
![Real-time Collaboration](docs/gifs/realtime.gif)

**Step 5:** *Multi-user simultaneous editing → Live drag & drop → Text updates → Node resizing → All synchronized instantly*

---

## 🤖 **AI Intelligence Suite**

### **🏷️ Smart Content Categorization*
![AI Categorization Demo](docs/gifs/Catagorize.gif)

*Select multiple nodes → AI analysis via Hugging Face → Automatic intelligent tagging → Organized workspace*

### **📊 Analytics Dashboard**
![Snapshot Analytics](docs/gifs/SnapShot.gif)

*Real-time canvas insights → Interactive pie charts → Checklist completion tracking → Project health metrics*

---

## 🎯 **Use Cases**

- **Product Teams**: Feature planning, user journey mapping, sprint planning
- **Designers**: Mood boards, design systems, collaborative wireframing  
- **Educators**: Interactive lesson planning, collaborative learning spaces
- **Consultants**: Client workshops, strategy sessions, project visualization
- **Developers**: System architecture, API design, technical documentation

---

## 📊 **Performance & Scale**

- **Real-time Updates**: Sub-100ms synchronization across clients
- **Serverless Architecture**: Auto-scaling based on demand
- **Optimized Database**: Dual-database strategy for performance and consistency
- **Modern Stack**: Built with latest React 19 and TypeScript for maintainability

---

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 **Author**

**Your Name**
- Portfolio: [your-portfolio.com](https://your-portfolio.com)
- LinkedIn: [linkedin.com/in/yourname](https://linkedin.com/in/yourname)
- Email: your.email@example.com

---

## 🙏 **Acknowledgments**

- Firebase team for real-time infrastructure
- ReactFlow community for canvas capabilities
- Google Gemini for AI intelligence
- Hugging Face for ML model access

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

[Live Demo](https://your-synapse-app.netlify.app) • [Documentation](https://docs.synapse.com) • [Report Bug](https://github.com/yourusername/synapse/issues)

</div>