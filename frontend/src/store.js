// src/store.js
import { create } from "zustand";
import apiFetch from "./utils/apiClient";
const API_URL = import.meta.env.VIE_API_URL || "http://localhost:8000";

export const useAppStore = create((set, get) => ({
  user: {
    username: "John Doe",
    email: "123@gmail.com",
    avatar: "",
  },
  currentNote: {},
  notes: [],
  loading: false,
  error: null,

  // ===== User =====
  fetchUser: async () => {
    try {
      set({ loading: true, error: null });
      const res = await apiFetch("/user/get-user", { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      set({ user: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  updateUser: async (updates) => {
    try {
      const res = await apiFetch("/user/update-user", {
        method: "POST",
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update user");
      const updated = await res.json();
      set({ user: updated });
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
      const res = await fetch(`${API_URL}/user/change-avatar`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to change avatar");
      const updatedUser = await res.json();
      set({ user: updatedUser });
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
      const res = await apiFetch("/notes/", { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      set({ notes: data, loading: false });
    } catch (err) {
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
        method: "PUT",
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update note");
      const updated = await res.json();
      set({
        notes: get().notes.map((n) => (n._id === id ? updated : n)),
      });
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

  getNoteById: async (id) => {
    try {
      const res = await apiFetch(`/notes/${id}`, { method: "GET" });
      if (!res.ok) throw new Error("Failed to load the note");
      const data = await res.data.json();
      set({ currentNote: data });
    } catch (err) {
      console.error(err);
    }
  },
}));
