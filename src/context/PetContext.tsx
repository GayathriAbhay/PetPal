import React, { createContext, useContext, useEffect, useState } from "react";
const generateId = () => {
  try {
    if (typeof crypto !== "undefined" && (crypto as any).randomUUID) {
      return (crypto as any).randomUUID();
    }
  } catch (e) {
    // ignore
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
};

// Types
export type Pet = {
  id: string;
  name: string;
  breed: string;
  age: string;
  location: string;
  image: string;
  description: string;
  status?: "available" | "adopted";
};

export type HealthRecord = {
  id: string;
  petId: string;
  title: string;
  notes?: string;
  date: string; // ISO
};

export type Alert = {
  id: string;
  petId?: string;
  title: string;
  location?: string;
  resolved?: boolean;
  date: string;
};

export type Post = {
  id: string;
  author: string;
  title: string;
  content: string;
  date: string;
};

export type AdoptionRequest = {
  id: string;
  petId: string;
  requester: string;
  message?: string;
  date: string;
  status?: "pending" | "accepted" | "rejected";
};

type PetContextValue = {
  pets: Pet[];
  healthRecords: HealthRecord[];
  alerts: Alert[];
  posts: Post[];
  adoptionRequests: AdoptionRequest[];
  addPet: (p: Omit<Pet, "id">) => Pet;
  updatePet: (id: string, patch: Partial<Pet>) => void;
  getPet: (id: string) => Pet | undefined;
  addHealthRecord: (r: Omit<HealthRecord, "id" | "date"> & { date?: string }) => HealthRecord;
  getHealthForPet: (petId: string) => HealthRecord[];
  addAlert: (a: Omit<Alert, "id" | "date"> & { date?: string }) => Alert;
  getAlerts: () => Alert[];
  addPost: (p: Omit<Post, "id" | "date">) => Post;
  getPosts: () => Post[];
  requestAdoption: (r: Omit<AdoptionRequest, "id" | "date" | "status">) => AdoptionRequest;
};

const StorageKeys = {
  pets: "petpal_pets_v1",
  health: "petpal_health_v1",
  alerts: "petpal_alerts_v1",
  posts: "petpal_posts_v1",
  adoption: "petpal_adoption_v1",
};

const defaultPets: Pet[] = [
  {
    id: "1",
    name: "Luna",
    breed: "Golden Retriever",
    age: "2 years",
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=800&fit=crop&crop=faces",
    description: "Luna is a gentle, loving dog who adores children and other pets. She's house-trained and knows basic commands.",
    status: "available",
  },
  {
    id: "2",
    name: "Whiskers",
    breed: "Maine Coon",
    age: "3 years",
    location: "Oakland, CA",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=800&fit=crop&crop=faces",
    description: "Whiskers is a calm and affectionate cat who loves to cuddle. Perfect for families looking for a gentle companion.",
    status: "available",
  },
];

const PetContext = createContext<PetContextValue | undefined>(undefined);

export const PetProvider = ({ children }: { children: React.ReactNode }) => {
  const [pets, setPets] = useState<Pet[]>(() => {
    try {
      const raw = localStorage.getItem(StorageKeys.pets);
      return raw ? JSON.parse(raw) : defaultPets;
    } catch (e) {
      return defaultPets;
    }
  });

  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(() => {
    try {
      const raw = localStorage.getItem(StorageKeys.health);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [alerts, setAlerts] = useState<Alert[]>(() => {
    try {
      const raw = localStorage.getItem(StorageKeys.alerts);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const raw = localStorage.getItem(StorageKeys.posts);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequest[]>(() => {
    try {
      const raw = localStorage.getItem(StorageKeys.adoption);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(StorageKeys.pets, JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    localStorage.setItem(StorageKeys.health, JSON.stringify(healthRecords));
  }, [healthRecords]);

  useEffect(() => {
    localStorage.setItem(StorageKeys.alerts, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem(StorageKeys.posts, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(StorageKeys.adoption, JSON.stringify(adoptionRequests));
  }, [adoptionRequests]);

  const addPet = (p: Omit<Pet, "id">) => {
    const newPet: Pet = { ...p, id: generateId() };
    setPets((s) => [newPet, ...s]);
    return newPet;
  };

  const updatePet = (id: string, patch: Partial<Pet>) => {
    setPets((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const getPet = (id: string) => pets.find((p) => p.id === id);

  const addHealthRecord = (r: Omit<HealthRecord, "id" | "date"> & { date?: string }) => {
    const record: HealthRecord = { ...r, id: generateId(), date: r.date || new Date().toISOString() } as HealthRecord;
    setHealthRecords((s) => [record, ...s]);
    return record;
  };

  const getHealthForPet = (petId: string) => healthRecords.filter((h) => h.petId === petId);

  const addAlert = (a: Omit<Alert, "id" | "date"> & { date?: string }) => {
    const alert: Alert = { ...a, id: generateId(), date: a.date || new Date().toISOString(), resolved: a.resolved || false };
    setAlerts((s) => [alert, ...s]);
    return alert;
  };

  const getAlerts = () => alerts;

  const addPost = (p: Omit<Post, "id" | "date">) => {
    const post: Post = { ...p, id: generateId(), date: new Date().toISOString() };
    setPosts((s) => [post, ...s]);
    return post;
  };

  const getPosts = () => posts;

  const requestAdoption = (r: Omit<AdoptionRequest, "id" | "date" | "status">) => {
    const req: AdoptionRequest = { ...r, id: generateId(), date: new Date().toISOString(), status: "pending" };
    setAdoptionRequests((s) => [req, ...s]);
    return req;
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        healthRecords,
        alerts,
        posts,
        adoptionRequests,
        addPet,
        updatePet,
        getPet,
        addHealthRecord,
        getHealthForPet,
        addAlert,
        getAlerts,
        addPost,
        getPosts,
        requestAdoption,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export const usePetContext = () => {
  const ctx = useContext(PetContext);
  if (!ctx) throw new Error("usePetContext must be used within PetProvider");
  return ctx;
};
