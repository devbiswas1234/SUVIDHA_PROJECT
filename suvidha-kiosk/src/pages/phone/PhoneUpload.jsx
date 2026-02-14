import React, { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function PhoneUpload() {
  const { sessionId } = useParams();

  const fileRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = useMemo(() => {
    return `http://localhost:5000/api/uploads/${sessionId}`;
  }, [sessionId]);

  function onPickFiles(e) {
    setError("");
    setDone(false);

    const selected = Array.from(e.target.files || []);

    if (selected.length > 5) {
      setError("You can upload maximum 5 files.");
      return;
    }

    setFiles(selected);
  }

  async function handleUpload() {
    setError("");
    setDone(false);

    if (!sessionId) {
      setError("Invalid session. Please rescan QR from kiosk.");
      return;
    }

    if (files.length === 0) {
      setError("Please select at least 1 file.");
      return;
    }

    try {
      setUploading(true);

      const form = new FormData();
      files.forEach((f) => form.append("files", f));

      const res = await fetch(apiUrl, {
        method: "POST",
        body: form,
      });

      const data = await res.json().catch(() => ({}));

      // ✅ Session expired case (410)
      if (res.status === 410) {
        throw new Error(
          data?.message || "Session expired. Please rescan QR from kiosk."
        );
      }

      if (!res.ok) {
        throw new Error(data?.message || "Upload failed");
      }

      setDone(true);
      setFiles([]);

      // reset file input
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 18,
        background: "#0b1220",
        color: "white",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          background: "rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: 18,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 22 }}>SUVIDHA Document Upload</h2>
        <p style={{ opacity: 0.8, marginTop: 8 }}>
          Upload your documents for your complaint/application.
        </p>

        <div style={{ marginTop: 16 }}>
          <input
            ref={fileRef}
            type="file"
            multiple
            onChange={onPickFiles}
            disabled={uploading || done}
            style={{ width: "100%" }}
          />
        </div>

        {files.length > 0 && (
          <div style={{ marginTop: 14, opacity: 0.9 }}>
            <b>Selected files:</b>
            <ul>
              {files.map((f) => (
                <li key={f.name}>
                  {f.name} ({Math.ceil(f.size / 1024)} KB)
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 12,
              background: "rgba(255,0,0,0.15)",
            }}
          >
            ❌ {error}
          </div>
        )}

        {done && (
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 12,
              background: "rgba(0,255,0,0.12)",
            }}
          >
            ✅ Upload successful. You can close this page.
          </div>
        )}

        {!done && (
          <button
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            style={{
              width: "100%",
              marginTop: 14,
              padding: 14,
              borderRadius: 14,
              border: "none",
              background:
                uploading || files.length === 0 ? "#3b3b3b" : "#2b7fff",
              color: "white",
              fontSize: 16,
              cursor:
                uploading || files.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        )}

        <div style={{ marginTop: 12, opacity: 0.7, fontSize: 12 }}>
          Session: {sessionId}
        </div>
      </div>
    </div>
  );
}
