import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";

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
  loading: boolean;
  addPet: (p: Omit<Pet, "id">) => Promise<Pet>;
  updatePet: (id: string, patch: Partial<Pet>) => void;
  getPet: (id: string) => Pet | undefined;
  addHealthRecord: (r: Omit<HealthRecord, "id" | "date"> & { date?: string }) => Promise<HealthRecord>;
  getHealthForPet: (petId: string) => HealthRecord[];
  addAlert: (a: Omit<Alert, "id" | "date"> & { date?: string }) => Promise<Alert>;
  getAlerts: () => Alert[];
  addPost: (p: Omit<Post, "id" | "date">) => Promise<Post>;
  getPosts: () => Post[];
  requestAdoption: (r: Omit<AdoptionRequest, "id" | "date" | "status">) => Promise<AdoptionRequest>;
};

const StorageKeys = {
  pets: "petpal_pets_v1",
  health: "petpal_health_v1",
  alerts: "petpal_alerts_v1",
  posts: "petpal_posts_v1",
  adoption: "petpal_adoption_v1",
  queue: "petpal_queue_v1",
};

const PetContext = createContext<PetContextValue | undefined>(undefined);

export const PetProvider = ({ children }: { children: React.ReactNode }) => {
  const [pets, setPets] = useState<Pet[]>(() => {
    try {
      const raw = localStorage.getItem(StorageKeys.pets);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
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

  const [loading, setLoading] = useState<boolean>(true);

  // Sync with server on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [serverPets, serverHealth, serverPosts, serverAlerts, serverAdoptions] = await Promise.all([
          apiFetch("/api/pets").catch(() => null),
          apiFetch("/api/medical-records").catch(() => null),
          apiFetch("/api/posts").catch(() => null),
          apiFetch("/api/alerts").catch(() => null),
          apiFetch("/api/adoptions").catch(() => null),
        ]);
        if (!mounted) return;
        if (serverPets) setPets(serverPets as Pet[]);
        if (serverHealth) setHealthRecords(serverHealth as HealthRecord[]);
        if (serverPosts) setPosts(serverPosts as Post[]);
        if (serverAlerts) setAlerts(serverAlerts as Alert[]);
        if (serverAdoptions) setAdoptionRequests(serverAdoptions as AdoptionRequest[]);
      } catch (e) {
        // ignore, keep local fallback
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

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

  // Sync queue logic: store operations locally and retry
  type QueueOp = { id: string; method: string; path: string; body: any };

  const readQueue = (): QueueOp[] => {
    try {
      const raw = localStorage.getItem(StorageKeys.queue);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  };

  const writeQueue = (q: QueueOp[]) => {
    try { localStorage.setItem(StorageKeys.queue, JSON.stringify(q)); } catch (e) {}
  };

  const enqueue = (op: Omit<QueueOp, "id">) => {
    const q = readQueue();
    q.push({ id: generateId(), ...op });
    writeQueue(q);
  };

  const processQueue = async () => {
    const q = readQueue();
    if (!q.length) return;
    const remaining: QueueOp[] = [];
    for (const op of q) {
      try {
        const res = await apiFetch(op.path, { method: op.method, body: JSON.stringify(op.body) });
        // apply server result locally if possible
        if (op.path.startsWith("/api/pets") && res) setPets((s) => [res as Pet, ...s.filter((p) => p.id !== (res as any).id)]);
        if (op.path.startsWith("/api/medical-records") && res) setHealthRecords((s) => [res as HealthRecord, ...s.filter((r) => r.id !== (res as any).id)]);
        if (op.path.startsWith("/api/posts") && res) setPosts((s) => [res as Post, ...s.filter((p) => p.id !== (res as any).id)]);
        if (op.path.startsWith("/api/alerts") && res) setAlerts((s) => [res as Alert, ...s.filter((a) => a.id !== (res as any).id)]);
        if (op.path.startsWith("/api/adoptions") && res) setAdoptionRequests((s) => [res as AdoptionRequest, ...s.filter((a) => a.id !== (res as any).id)]);
      } catch (e) {
        remaining.push(op);
      }
    }
    writeQueue(remaining);
  };

  // poll queue every 20s and on online
  useEffect(() => {
    const iv = setInterval(processQueue, 20000);
    window.addEventListener("online", processQueue);
    return () => {
      clearInterval(iv);
      window.removeEventListener("online", processQueue);
    };
  }, []);

  // CRUD operations — prefer server, fallback to local + queue
  const addPet = async (p: Omit<Pet, "id">) => {
    try {
      const created = await apiFetch("/api/pets", { method: "POST", body: JSON.stringify(p) });
      setPets((s) => [created as Pet, ...s]);
      toast({ title: "Pet created", description: `${(created as Pet).name} added.` });
      return created as Pet;
    } catch (e) {
      const newPet: Pet = { ...p, id: generateId() };
      setPets((s) => [newPet, ...s]);
      enqueue({ method: "POST", path: "/api/pets", body: newPet });
      toast({ title: "Offline: Pet saved locally", description: `Saved ${newPet.name} locally.` });
      return newPet;
    }
  };

  const updatePet = (id: string, patch: Partial<Pet>) => {
    setPets((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const getPet = (id: string) => pets.find((p) => p.id === id);

  const addHealthRecord = async (r: Omit<HealthRecord, "id" | "date"> & { date?: string }) => {
    try {
      const created = await apiFetch("/api/medical-records", { method: "POST", body: JSON.stringify(r) });
      setHealthRecords((s) => [created as HealthRecord, ...s]);
      toast({ title: "Health record added" });
      return created as HealthRecord;
    } catch (e) {
      const record: HealthRecord = { ...r, id: generateId(), date: r.date || new Date().toISOString() } as HealthRecord;
      setHealthRecords((s) => [record, ...s]);
      enqueue({ method: "POST", path: "/api/medical-records", body: record });
      toast({ title: "Offline: Health record saved locally" });
      return record;
    }
  };

  const getHealthForPet = (petId: string) => healthRecords.filter((h) => h.petId === petId);

  const addAlert = async (a: Omit<Alert, "id" | "date"> & { date?: string }) => {
    try {
      const created = await apiFetch("/api/alerts", { method: "POST", body: JSON.stringify(a) });
      setAlerts((s) => [created as Alert, ...s]);
      toast({ title: "Alert created" });
      return created as Alert;
    } catch (e) {
      const alert: Alert = { ...a, id: generateId(), date: a.date || new Date().toISOString(), resolved: a.resolved || false };
      setAlerts((s) => [alert, ...s]);
      enqueue({ method: "POST", path: "/api/alerts", body: alert });
      toast({ title: "Offline: Alert saved locally" });
      return alert;
    }
  };

  const getAlerts = () => alerts;

  const addPost = async (p: Omit<Post, "id" | "date">) => {
    try {
      const created = await apiFetch("/api/posts", { method: "POST", body: JSON.stringify(p) });
      setPosts((s) => [created as Post, ...s]);
      toast({ title: "Posted to forum" });
      return created as Post;
    } catch (e) {
      const post: Post = { ...p, id: generateId(), date: new Date().toISOString() };
      setPosts((s) => [post, ...s]);
      enqueue({ method: "POST", path: "/api/posts", body: post });
      toast({ title: "Offline: Post saved locally" });
      return post;
    }
  };

  const getPosts = () => posts;

  const requestAdoption = async (r: Omit<AdoptionRequest, "id" | "date" | "status">) => {
    try {
      const created = await apiFetch("/api/adoptions", { method: "POST", body: JSON.stringify(r) });
      setAdoptionRequests((s) => [created as AdoptionRequest, ...s]);
      toast({ title: "Adoption requested" });
      return created as AdoptionRequest;
    } catch (e) {
      const req: AdoptionRequest = { ...r, id: generateId(), date: new Date().toISOString(), status: "pending" } as AdoptionRequest;
      setAdoptionRequests((s) => [req, ...s]);
      enqueue({ method: "POST", path: "/api/adoptions", body: req });
      toast({ title: "Offline: Adoption request saved locally" });
      return req;
    }
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        healthRecords,
        alerts,
        posts,
        adoptionRequests,
        loading,
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
