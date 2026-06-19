// src/store.js
import { create } from "zustand";
import apiFetch from "./utils/apiClient";

export const useAppStore = create((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  activeNoteId: null,
  setActiveNoteId: (id) => set({ activeNoteId: id }),
  notes: [],
  loading: false,
  error: null,
  // Set to a note id right after creation so the editor can focus its title.
  justCreatedId: null,
  clearJustCreated: () => set({ justCreatedId: null }),

  // ===== User =====
  fetchUser: async () => {
    try {
      set({ loading: true, error: null });
      const res = await apiFetch("/user/get-user", { method: "GET" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to fetch user: ${res.status} ${text}`);
      }
      const body = await res.json();
      set({ user: body.data, loading: false });
    } catch (err) {
      console.error(err);
      set({ error: err.message, loading: false });
    }
  },

  updateUser: async (updates) => {
    const res = await apiFetch("/user/update-user", {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.message || "Failed to update user");
    set({ user: body.data });
    return body;
  },

  changePassword: async (passwordData) => {
    const res = await apiFetch("/user/change-password", {
      method: "POST",
      body: JSON.stringify({
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(body.message || "Failed to change password");
    }
    return body;
  },

  changeAvatar: async (formData) => {
    const res = await apiFetch("/user/change-avatar", {
      method: "PUT",
      body: formData,
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.message || "Failed to change avatar");
    set({ user: body.data });
    return body;
  },

  logout: async () => {
    try {
      await apiFetch("/user/logout", { method: "POST" });
      set({ user: null, notes: [] });
    } catch (err) {
      console.error(err);
    }
  },

  // ===== Notes =====
  fetchNotes: async () => {
    try {
      set({ loading: true, error: null });
      const res = await apiFetch("/notes", { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch notes");
      const body = await res.json();
      set({ notes: body.data, loading: false });
    } catch (err) {
      console.error(err);
      set({ error: err.message, loading: false });
    }
  },

  createNote: async (noteData) => {
    try {
      const res = await apiFetch("/notes", {
        method: "POST",
        body: JSON.stringify(noteData),
      });
      if (!res.ok) throw new Error("Failed to create note");
      const body = await res.json();
      const newNote = body.data;
      set({ notes: [newNote, ...get().notes], justCreatedId: newNote._id });
      return newNote;
    } catch (err) {
      console.error(err);
    }
  },

  updateNote: async (id, updates) => {
    try {
      const res = await apiFetch(`/notes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update note");
      const body = await res.json();
      const updated = body.data;
      set({
        notes: get().notes.map((n) => (n._id === id ? updated : n)),
      });
      return updated;
    } catch (err) {
      console.error(err);
    }
  },

  deleteNote: async (id) => {
    try {
      const res = await apiFetch(`/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete note");
      set({ notes: get().notes.filter((n) => n._id !== id) });
    } catch (err) {
      console.error(err);
    }
  },
}));
