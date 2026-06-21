import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, remove, connectDatabaseEmulator } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase config is sourced entirely from environment variables.
// Local dev reads these from .env.local; production reads them from Vercel.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Fail loudly if the config is missing so misconfigured deploys are obvious.
if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL) {
  console.error(
    "Firebase env vars are missing. Set NEXT_PUBLIC_FIREBASE_* in .env.local (local) and in Vercel (production)."
  );
}

// Initialize Firebase
let app;
let database;
let auth;

try {
  console.log('Initializing Firebase with config:', {
    ...firebaseConfig,
    apiKey: '***' // Hide API key in logs
  });
  
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  auth = getAuth(app);
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

// Initialize Analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.error('Error initializing Analytics:', error);
  }
}

// Auth state listener
let authStateListener = null;

export const initAuthStateListener = (callback) => {
  if (authStateListener) {
    authStateListener(); // Remove existing listener if any
  }
  
  authStateListener = onAuthStateChanged(auth, (user) => {
    callback(user);
  });

  return () => {
    if (authStateListener) {
      authStateListener();
      authStateListener = null;
    }
  };
};

// Authentication functions
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login successful");
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    let errorMessage = "Login failed";
    
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
      default:
        errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("Logout successful");
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error(`Logout failed: ${error.message}`);
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

// Profile Management Functions
export const fetchProfile = async () => {
  try {
    console.log('Fetching profile data...');
    const profileRef = ref(database, 'profile');
    const snapshot = await get(profileRef);
    const data = snapshot.val();
    console.log('Profile data received:', data);
    
    if (!data) {
      console.log('No profile data found, using default values');
      return {
        name: "Ali Dahou",
        title: "Full Stack Developer",
        bio: "I'm a passionate developer...",
        profileImage: "/images/profile-image.jpg",
        logo: "/images/logo.png",
        socialLinks: {
          github: "https://github.com/ldbtech",
          linkedin: "https://www.linkedin.com/in/alidaho/"
        }
      };
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }
};

export const saveProfile = async (profileData) => {
  try {
    if (!auth.currentUser) {
      throw new Error("Authentication required");
    }

    const profileRef = ref(database, 'profile');
    await set(profileRef, profileData);
    console.log("Profile saved successfully");
    return true;
  } catch (error) {
    console.error("Error in saveProfile:", error);
    throw new Error(`Failed to save profile: ${error.message}`);
  }
};

// Database functions with error handling
export const fetchData = async (path) => {
  try {
    console.log(`Fetching data from path: ${path}`);
    const dataRef = ref(database, path);
    const snapshot = await get(dataRef);
    const data = snapshot.val();
    console.log(`Data received from ${path}:`, data);

    if (!data) {
      console.warn(`No data found at path: ${path}`);
      if (path === 'about') {
        // Return default structure for about section
        return {
          bio: '',
          images: {
            profile: '',
            background: '',
            additional: []
          },
          skillGroups: [
            { title: 'Frontend Development', items: [] },
            { title: 'Backend Development', items: [] },
            { title: 'Database & Cloud', items: [] },
            { title: 'Tools & Others', items: [] }
          ],
          experience: [],
          education: [],
          tools: []
        };
      }
      return null;
    }

    // If data exists, ensure image URLs are properly formatted
    if (data && data.images) {
      Object.keys(data.images).forEach(key => {
        if (data.images[key] && !data.images[key].startsWith('http')) {
          data.images[key] = data.images[key].startsWith('/') 
            ? data.images[key] 
            : `/${data.images[key]}`;
        }
      });
    }

    return data;
  } catch (error) {
    console.error(`Error fetching data from ${path}:`, error);
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
};

export const saveProject = async (project) => {
  try {
    if (!auth.currentUser) {
      throw new Error("Authentication required");
    }

    if (!project.id) {
      throw new Error("Project ID is required");
    }

    const projectRef = ref(database, `projects/${project.id}`);
    console.log("Saving project to database:", project);
    await set(projectRef, project);
    console.log("Project saved successfully");
    return true;
  } catch (error) {
    console.error("Error in saveProject:", error);
    throw new Error(`Failed to save project: ${error.message}`);
  }
};

export const saveAbout = async (data) => {
  try {
    if (!auth.currentUser) {
      throw new Error("Authentication required");
    }

    const aboutRef = ref(database, "about");
    await set(aboutRef, data);
    console.log("About section saved successfully");
    return true;
  } catch (error) {
    console.error("Error in saveAbout:", error);
    throw new Error(`Failed to save about section: ${error.message}`);
  }
};

// Freelance Configuration Management
export const fetchFreelanceConfig = async () => {
  try {
    console.log('Fetching freelance config...');
    const freelanceRef = ref(database, 'freelance');
    const snapshot = await get(freelanceRef);
    const data = snapshot.val();
    console.log('Freelance config received:', data);
    
    if (!data) {
      console.log('No freelance config found, using default values');
      return {
        bio: "I build fast, beautiful, and secure SaaS products, AI automated workflows, and custom web applications.",
        hourlyRate: "50",
        projectStartingPrice: "1500",
        status: "Accepting Freelance Projects",
        services: [
          {
            id: "1",
            title: "SaaS MVP Development",
            description: "Go from concept to launching your full-stack product in 3-4 weeks. Built with modern, scalable web tech.",
            price: "2500",
            duration: "3-4 weeks",
            features: ["Custom Database Design", "User Authentication & Roles", "Stripe Subscription Payment Flow", "Premium Responsive UI"],
            icon: "rocket"
          },
          {
            id: "2",
            title: "AI Automation & LLMs",
            description: "Integrate intelligent APIs, AI agents, and workflows that automate manual work and save hours.",
            price: "1500",
            duration: "1-2 weeks",
            features: ["OpenAI / Gemini integrations", "Custom AI Agent creation", "Automated pipelines & scripts", "API integrations"],
            icon: "brain"
          },
          {
            id: "3",
            title: "Premium Web App",
            description: "High-performance, beautifully designed web apps optimized for SEO, speed, and mobile responsiveness.",
            price: "1000",
            duration: "1-2 weeks",
            features: ["React/Next.js dynamic builds", "Tailwind clean CSS layouts", "SEO Meta Optimization", "Dynamic CMS integrations"],
            icon: "code"
          }
        ],
        process: [
          {
            id: "1",
            stepNumber: "1",
            title: "Alignment & Pricing",
            description: "We define scope, pricing packages, deliverables, and timeline."
          },
          {
            id: "2",
            stepNumber: "2",
            title: "Weekly Delivery",
            description: "Regular updates on staging server. You see the product evolve week-by-week."
          },
          {
            id: "3",
            stepNumber: "3",
            title: "QA & Handover",
            description: "Testing features, final host deployment, and all codebase ownership handoff."
          }
        ]
      };
    }
    
    // Support either array or dictionary format from database
    const servicesList = data.services
      ? (Array.isArray(data.services) ? data.services : Object.values(data.services))
      : [];

    const processList = data.process
      ? (Array.isArray(data.process) ? data.process : Object.values(data.process))
      : [];

    return {
      bio: data.bio || '',
      hourlyRate: data.hourlyRate || '',
      projectStartingPrice: data.projectStartingPrice || '',
      status: data.status || 'Accepting Freelance Projects',
      services: servicesList,
      process: processList.sort((a, b) => (Number(a.stepNumber) || 0) - (Number(b.stepNumber) || 0))
    };
  } catch (error) {
    console.error("Error fetching freelance config:", error);
    throw new Error(`Failed to fetch freelance config: ${error.message}`);
  }
};

export const saveFreelanceConfig = async (freelanceData) => {
  try {
    if (!auth.currentUser) {
      throw new Error("Authentication required");
    }

    const freelanceRef = ref(database, 'freelance');
    await set(freelanceRef, freelanceData);
    console.log("Freelance configuration saved successfully");
    return true;
  } catch (error) {
    console.error("Error in saveFreelanceConfig:", error);
    throw new Error(`Failed to save freelance config: ${error.message}`);
  }
};

// Visitor tracking functions
export const incrementVisitorCount = async () => {
  try {
    const visitorRef = ref(database, 'visitors');
    const snapshot = await get(visitorRef);
    const currentCount = snapshot.val()?.count || 0;
    
    await set(visitorRef, {
      count: currentCount + 1,
      lastUpdated: new Date().toISOString()
    });
    
    return currentCount + 1;
  } catch (error) {
    console.error("Error incrementing visitor count:", error);
    return null;
  }
};

export const getVisitorCount = async () => {
  try {
    const visitorRef = ref(database, 'visitors');
    const snapshot = await get(visitorRef);
    return snapshot.val()?.count || 0;
  } catch (error) {
    console.error("Error getting visitor count:", error);
    return 0;
  }
};

export const getProjectCount = async () => {
  try {
    const projectsRef = ref(database, 'projects');
    const snapshot = await get(projectsRef);
    const projects = snapshot.val();
    return projects ? Object.keys(projects).length : 0;
  } catch (error) {
    console.error("Error getting project count:", error);
    return 0;
  }
};


// Export the database instance
export { database };

// Add thoughts-related functions
export const saveThought = async (thought) => {
  try {
    const thoughtRef = ref(database, `thoughts/${thought.id}`);
    await set(thoughtRef, thought);
    return true;
  } catch (error) {
    console.error('Error saving thought:', error);
    throw error;
  }
};

export const deleteThought = async (thoughtId) => {
  try {
    const thoughtRef = ref(database, `thoughts/${thoughtId}`);
    await remove(thoughtRef);
    return true;
  } catch (error) {
    console.error('Error deleting thought:', error);
    throw error;
  }
};

export default database; 