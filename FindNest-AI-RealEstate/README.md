# FindNest AI Real Estate Agent 🏡✨

FindNest is an intelligent, agent-driven real estate platform designed to revolutionize the way people search for apartments and rooms in Hanoi. Built on a modern tech stack, it integrates AI to provide a conversational, highly contextual, and personalized room-hunting experience.

## 🌟 Key Features

*   **Conversational AI Search (RAG)**: Users can chat naturally with the AI (e.g., "Find me a pet-friendly room under 4 million VND in Cau Giay with a chill balcony"). The AI autonomously queries the Supabase database and returns highly relevant listings.
*   **Semantic Search Capability**: The AI is equipped with tools to perform deep semantic searches on listing descriptions, capturing subjective requirements (like "quiet", "newly built", "no live-in landlord") that traditional filters miss.
*   **Automated Listing Management**: Robust crawling and database management scripts to keep the listings fresh and accurate.
*   **Interactive Maps & UI**: A stunning, responsive UI built with Next.js, featuring dynamic maps, interactive listing cards, and a seamless chat interface.
*   **Authentication & Favorites**: Secure user authentication via Supabase Auth, allowing users to save their favorite rooms.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React 19)
*   **AI Engine**: [Vercel AI SDK](https://sdk.vercel.ai/docs) powered by Google Gemini (gemini-2.5-flash)
*   **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
*   **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js >= 24
- A Supabase account and project
- A Google Gemini API Key

### Installation

1.  **Clone the repository** (Note: This project is part of a larger portfolio monorepo):
    ```bash
    git clone https://github.com/thaibuivan/BuiVanThai-Portfolio.git
    cd BuiVanThai-Portfolio/FindNest-AI-RealEstate
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env.local` file in the root directory and add the following keys:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧠 Why Vercel AI SDK over LangGraph?
This project deliberately chooses the Vercel AI SDK over heavy orchestration frameworks like LangGraph to maintain a lean, sharp, and highly responsive edge-ready architecture. The Vercel AI SDK provides native UI streaming capabilities perfectly suited for Next.js, while still allowing infinite extensibility through custom `tools` for agentic behavior.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
