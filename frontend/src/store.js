// src/store.js
import { create } from "zustand";
import apiFetch from "./utils/apiClient";
const API_URL =
  import.meta.env.VITE_API_URL || "https://simpli-notes-backend.vercel.app/";

export const useAppStore = create((set, get) => ({
  user: null,
  activeNoteId: null,
  setActiveNoteId: (id) => set({ activeNoteId: id }),
  notes: [],
  loading: false,
  error: null,

  // ===== User =====
  fetchUser: async () => {
    try {
      set({ loading: true, error: null });
      const res = await apiFetch("/user/get-user", { method: "GET" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to fetch uer: ${res.status} ${text}`);
      }
      const body = await res.json();
      set({ user: body.data, loading: false });
    } catch (err) {
      console.error(err);
      set({ error: err.message, loading: false });
    }
  },

  updateUser: async (updates) => {
    try {
      const res = await apiFetch("/user/update-user", {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update user");
      const updated = await res.json();
      set({ user: updated.data });
      return updated;
    } catch (err) {
      console.error(err);
    }
  },

  changePassword: async (passwordData) => {
    try {
      const res = await apiFetch("/user/change-password", {
        method: "POST",
        body: JSON.stringify(passwordData),
      });
      if (!res.ok) throw new Error("Failed to change password");
      return await res.json();
    } catch (err) {
      console.error(err);
    }
  },

  changeAvatar: async (formData) => {
    try {
      const res = await apiFetch("/user/change-avatar", {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to change avatar");
      const updatedUser = await res.json();
      set({ user: updatedUser.data });
      return updatedUser;
    } catch (err) {
      console.error(err);
    }
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
      const newNote = await res.json();
      set({ notes: [...get().notes, newNote] });
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
