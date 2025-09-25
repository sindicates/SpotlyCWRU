/
├── public/               # Static assets (images, fonts, favicons) that are publicly accessible.
├── src/                  # This is where all of our application's source code lives.
│   ├── assets/           # Non-public assets like logos or illustrations used within components.
│   ├── components/       # Reusable React components. This is our primary component library.
│   │   ├── features/     # Components for a specific feature (e.g., auth, reviews, onboarding).
│   │   ├── shared/       # Complex components used across many pages (e.g., Navbar, Footer).
│   │   └── ui/           # Small, "dumb" UI building blocks (e.g., Button, Card, Input).
│   ├── hooks/            # Custom React hooks (e.g., useAuth, useFetchBuildings).
│   ├── lib/              # Library files and helper utilities.
│   │   └── supabaseClient.ts # The single, central file for initializing our Supabase client.
│   ├── pages/            # Page components. Each file here represents a page of our app.
│   ├── services/         # Functions for communicating with our backend (Supabase).
│   ├── types/            # TypeScript type definitions (e.g., User, Review, Building).
│   ├── App.tsx           # The main application component where all our routing logic lives.
│   ├── index.css         # Global CSS styles and Tailwind directives.
│   └── main.tsx          # The main entry point of the entire application.
├── .env                  # Your secret API keys for Supabase (DO NOT COMMIT).
└── package.json          # A list of all project dependencies.