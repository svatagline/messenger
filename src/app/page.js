"use client";

import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    sender: "",
    message: "",
    receiver: "",
  });
  const [document, setDocument] = useState(null);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Processing...");

    try {
      const fd = new FormData();
      fd.append("sender", form.sender);
      fd.append("message", form.message);
      fd.append("document", document);

      const saveRes = await fetch("/api/save-message", {
        method: "POST",
        body: fd,
      });

      if (!saveRes.ok) throw new Error("Save failed");

      const sendRes = await fetch("/api/send-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiver: form.receiver }),
      });

      if (!sendRes.ok) throw new Error("Send failed");

      setStatus("WhatsApp message sent successfully ✅");
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>WhatsApp Message Sender</h2>

      <input
        placeholder="Sender"
        value={form.sender}
        onChange={(e) => setForm({ ...form, sender: e.target.value })}
        required
      />

      <br />
      <br />

      <textarea
        placeholder="Message"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        required
      />

      <br />
      <br />

      <input
        type="file"
        accept=".pdf,image/*"
        onChange={(e) => setDocument(e.target.files[0])}
        required
      />

      <br />
      <br />

      <input
        placeholder="Receiver WhatsApp Number"
        value={form.receiver}
        onChange={(e) => setForm({ ...form, receiver: e.target.value })}
        required
      />

      <br />
      <br />

      <button type="submit">Send WhatsApp</button>

      <p>{status}</p>
    </form>
  );
}
