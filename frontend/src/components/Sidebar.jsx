import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("/notes/", {
          method: "GET",
          headers: {
            credentials: "inculde",
          },
        });
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error("failed to fetch notes", err);
      }
    };

    fetchNotes();
  }, [notes]);

  return <div></div>;
}
