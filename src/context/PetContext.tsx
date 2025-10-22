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
  { id: "p1", name: "Bella", breed: "Labrador Retriever", age: "4 years", location: "San Francisco, CA", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80", description: "Loves fetch and swimming. Great with kids.", status: "available" },
  { id: "p2", name: "Charlie", breed: "Beagle", age: "3 years", location: "Oakland, CA", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80", description: "Curious and energetic. Great for active families.", status: "available" },
  { id: "p3", name: "Luna", breed: "Golden Retriever", age: "2 years", location: "San Jose, CA", image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80", description: "Gentle and loving. Knows basic commands.", status: "available" },
  { id: "p4", name: "Max", breed: "German Shepherd", age: "5 years", location: "San Francisco, CA", image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&q=80", description: "Loyal and intelligent. Needs daily exercise.", status: "available" },
  { id: "p5", name: "Molly", breed: "Poodle", age: "1 year", location: "Berkeley, CA", image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&q=80", description: "Playful and very smart.", status: "available" },
  { id: "p6", name: "Simba", breed: "Domestic Short Hair", age: "3 years", location: "Oakland, CA", image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80", description: "Affectionate cat who loves naps.", status: "available" },
  { id: "p7", name: "Oliver", breed: "Maine Coon", age: "4 years", location: "San Mateo, CA", image: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80", description: "Calm and gentle giant.", status: "available" },
  { id: "p8", name: "Lucy", breed: "Siamese", age: "2 years", location: "San Francisco, CA", image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80&crop=faces", description: "Talkative and affectionate.", status: "available" },
  { id: "p9", name: "Bailey", breed: "Beagle", age: "6 years", location: "Palo Alto, CA", image: "https://images.unsplash.com/photo-1507149833265-60c372daea22?w=800&q=80", description: "Friendly and great with kids.", status: "available" },
  { id: "p10", name: "Cooper", breed: "Border Collie", age: "3 years", location: "Redwood City, CA", image: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=800&q=80", description: "Energetic and highly trainable.", status: "available" },
  { id: "p11", name: "Daisy", breed: "Shih Tzu", age: "2 years", location: "San Francisco, CA", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80&crop=faces", description: "Small and cuddly. Apartment friendly.", status: "available" },
  { id: "p12", name: "Loki", breed: "Mixed", age: "5 years", location: "Oakland, CA", image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&q=80", description: "Mischievous but loving.", status: "available" },
  { id: "p13", name: "Rocky", breed: "Boxer", age: "4 years", location: "San Jose, CA", image: "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?w=800&q=80", description: "Playful and athletic.", status: "available" },
  { id: "p14", name: "Sadie", breed: "Bulldog", age: "3 years", location: "Fremont, CA", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80&crop=faces", description: "Calm and good with kids.", status: "available" },
  { id: "p15", name: "Toby", breed: "Mixed", age: "2 years", location: "Mountain View, CA", image: "https://images.unsplash.com/photo-1507149833265-60c372daea22?w=800&q=80&crop=faces", description: "Friendly and adaptable.", status: "available" },
  { id: "p16", name: "Angel", breed: "Rabbit - Dutch", age: "1 year", location: "San Jose, CA", image: "https://images.unsplash.com/photo-1509099836639-18ba80b8b3d1?w=800&q=80", description: "Gentle and quiet.", status: "available" },
  { id: "p17", name: "Zoey", breed: "Parakeet", age: "1 year", location: "San Francisco, CA", image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80", description: "Chirpy and bright.", status: "available" },
  { id: "p18", name: "Chloe", breed: "Persian", age: "4 years", location: "Oakland, CA", image: "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?w=800&q=80&crop=faces", description: "Luxurious coat and calm temperament.", status: "available" },
  { id: "p19", name: "Harley", breed: "Husky", age: "3 years", location: "San Mateo, CA", image: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=800&q=80&crop=faces", description: "Active and loves the outdoors.", status: "available" },
  { id: "p20", name: "Ruby", breed: "Cocker Spaniel", age: "2 years", location: "Palo Alto, CA", image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&q=80&crop=faces", description: "Sweet-natured and playful.", status: "available" },
];

const defaultHealthRecords: HealthRecord[] = [
  { id: 'hr1', petId: 'p1', title: 'Annual Vaccination', notes: 'Rabies and DHPP given. Recommended flea prevention.', date: new Date().toISOString() },
  { id: 'hr2', petId: 'p2', title: 'Wellness Check', notes: 'Good condition. Slight ear wax.', date: new Date().toISOString() },
  { id: 'hr3', petId: 'p3', title: 'Spay/Neuter Follow-up', notes: 'Healing well.', date: new Date().toISOString() },
  { id: 'hr4', petId: 'p4', title: 'Injury Treatment', notes: 'Stitches removed. Advised rest.', date: new Date().toISOString() },
  { id: 'hr5', petId: 'p5', title: 'Puppy Vaccination', notes: 'First set of shots completed.', date: new Date().toISOString() },
  { id: 'hr6', petId: 'p6', title: 'Dental Check', notes: 'Recommended tooth cleaning.', date: new Date().toISOString() },
];

const defaultPosts: Post[] = [
  { id: 'post1', author: 'Admin', title: 'Welcome to PetPal Forum', content: 'Share tips, lost & found notices, and adoption stories here!', date: new Date().toISOString() },
  { id: 'post2', author: 'Jane', title: 'Best low-cost vets in SF', content: 'I recommend Downtown Vet and Happy Paws Clinic for affordable care.', date: new Date().toISOString() },
  { id: 'post3', author: 'Alex', title: 'Puppy training basics', content: 'Start with crate training and short positive sessions.', date: new Date().toISOString() },
];

const defaultAlerts: Alert[] = [
  { id: 'a1', petId: 'p9', title: 'Lost - Brown Tabby', location: 'Elm Street, Palo Alto', resolved: false, date: new Date().toISOString() },
  { id: 'a2', petId: 'p14', title: 'Found - Small dog near Market St', location: 'Market St, SF', resolved: false, date: new Date().toISOString() },
];

const defaultAdoptionRequests: AdoptionRequest[] = [
  { id: 'ar1', petId: 'p2', requester: 'Sam', message: 'Looking to adopt a friendly beagle.', date: new Date().toISOString(), status: 'pending' },
  { id: 'ar2', petId: 'p5', requester: 'Nina', message: 'Interested in Molly for my family.', date: new Date().toISOString(), status: 'pending' },
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
      return raw ? JSON.parse(raw) : defaultHealthRecords;
    } catch (e) {
      return defaultHealthRecords;
    }
  });

  const [alerts, setAlerts] = useState<Alert[]>(() => {
    try {
      const raw = localStorage.getItem(StorageKeys.alerts);
      return raw ? JSON.parse(raw) : defaultAlerts;
    } catch (e) {
      return defaultAlerts;
    }
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const raw = localStorage.getItem(StorageKeys.posts);
      return raw ? JSON.parse(raw) : defaultPosts;
    } catch (e) {
      return defaultPosts;
    }
  });

  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequest[]>(() => {
    try {
      const raw = localStorage.getItem(StorageKeys.adoption);
      return raw ? JSON.parse(raw) : defaultAdoptionRequests;
    } catch (e) {
      return defaultAdoptionRequests;
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
