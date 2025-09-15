import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

// Types
/**
 * @typedef {Object} Note
 * @property {string} id - Unique identifier
 * @property {string} title - Note title
 * @property {string} content - Note content
 * @property {number} updatedAt - Timestamp of last update
 */

// Utilities
const STORAGE_KEY = 'notes_app_notes_v1';

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const loadNotes = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

const saveNotes = (notes) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // ignore
  }
};

// PUBLIC_INTERFACE
export function formatDate(ts) {
  /** Format timestamp to readable string */
  const d = new Date(ts);
  return d.toLocaleString();
}

/**
 * Header component
 */
// PUBLIC_INTERFACE
function Header({ onNew, onDelete, canDelete, query, onQueryChange }) {
  /** Header: app title, search, and actions */
  return (
    <header className="nk-header">
      <div className="nk-brand">
        <div className="nk-logo">📝</div>
        <div className="nk-title-wrap">
          <h1 className="nk-title">Ocean Notes</h1>
          <p className="nk-subtitle">Capture ideas. Refine thoughts. Stay organized.</p>
        </div>
      </div>
      <div className="nk-actions">
        <div className="nk-search">
          <span className="nk-search-icon" aria-hidden>🔍</span>
          <input
            className="nk-input"
            placeholder="Search notes..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            aria-label="Search notes"
          />
        </div>
        <button className="nk-btn nk-btn-primary" onClick={onNew} aria-label="Create note">
          + New
        </button>
        <button
          className="nk-btn nk-btn-danger"
          onClick={onDelete}
          disabled={!canDelete}
          aria-label="Delete selected note"
          title={canDelete ? 'Delete selected note' : 'No note selected'}
        >
          Delete
        </button>
      </div>
    </header>
  );
}

/**
 * Sidebar list of notes
 */
// PUBLIC_INTERFACE
function NotesList({ notes, selectedId, onSelect }) {
  /** Sidebar list of notes */
  if (notes.length === 0) {
    return (
      <div className="nk-empty">
        <p>No notes yet</p>
        <p className="nk-empty-sub">Create your first note to get started.</p>
      </div>
    );
  }

  return (
    <ul className="nk-notes-list" role="list" aria-label="Notes list">
      {notes.map((n) => (
        <li key={n.id}>
          <button
            className={`nk-note-item ${selectedId === n.id ? 'is-active' : ''}`}
            onClick={() => onSelect(n.id)}
            aria-current={selectedId === n.id ? 'true' : 'false'}
          >
            <div className="nk-note-title" title={n.title || 'Untitled'}>
              {n.title?.trim() || 'Untitled'}
            </div>
            <div className="nk-note-meta">{formatDate(n.updatedAt)}</div>
            <div className="nk-note-snippet" title={n.content}>
              {(n.content || '').slice(0, 80) || 'No content'}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}

/**
 * Note editor
 */
// PUBLIC_INTERFACE
function NoteEditor({ note, onChange }) {
  /** Editor for a single note */
  if (!note) {
    return (
      <div className="nk-editor-empty">
        <div className="nk-editor-placeholder">
          Select a note to start editing, or create a new one.
        </div>
      </div>
    );
  }

  const handleTitle = (e) => {
    onChange({ ...note, title: e.target.value, updatedAt: Date.now() });
  };
  const handleContent = (e) => {
    onChange({ ...note, content: e.target.value, updatedAt: Date.now() });
  };

  return (
    <div className="nk-editor">
      <input
        className="nk-editor-title"
        value={note.title}
        onChange={handleTitle}
        placeholder="Title"
        aria-label="Note title"
      />
      <textarea
        className="nk-editor-content"
        value={note.content}
        onChange={handleContent}
        placeholder="Start typing your note..."
        aria-label="Note content"
      />
      <div className="nk-editor-footer">
        <span className="nk-updated">Last updated: {formatDate(note.updatedAt)}</span>
        <div className="nk-footer-actions">
          <span className="nk-tip">Changes are saved automatically</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Root App
 */
// PUBLIC_INTERFACE
export default function App() {
  /** Notes App with Ocean Professional modern style */
  const [notes, setNotes] = useState(() => loadNotes());
  const [selectedId, setSelectedId] = useState(() => (loadNotes()[0]?.id ?? null));
  const [query, setQuery] = useState('');

  // Persist to localStorage
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  // Derived: filtered and sorted notes
  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
    if (!q) return sorted;
    return sorted.filter(
      (n) =>
        (n.title || '').toLowerCase().includes(q) ||
        (n.content || '').toLowerCase().includes(q)
    );
  }, [notes, query]);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) || null,
    [notes, selectedId]
  );

  // Handlers
  const handleSelect = (id) => setSelectedId(id);

  const handleNew = () => {
    const newNote = {
      id: generateId(),
      title: '',
      content: '',
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedId(newNote.id);
  };

  const handleDelete = () => {
    if (!selectedId) return;
    setNotes((prev) => prev.filter((n) => n.id !== selectedId));
    // Select next available note
    const remaining = filteredNotes.filter((n) => n.id !== selectedId);
    setSelectedId(remaining[0]?.id || null);
  };

  const handleChange = (updated) => {
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  };

  return (
    <div className="nk-app">
      <Header
        onNew={handleNew}
        onDelete={handleDelete}
        canDelete={!!selectedId}
        query={query}
        onQueryChange={setQuery}
      />
      <main className="nk-main">
        <aside className="nk-sidebar" aria-label="Notes sidebar">
          <NotesList
            notes={filteredNotes}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </aside>
        <section className="nk-content" aria-label="Note editor">
          <NoteEditor note={selectedNote} onChange={handleChange} />
        </section>
      </main>
      <footer className="nk-footer">
        <span>Ocean Professional Theme</span>
        <span>•</span>
        <span>Modern, minimalist UI</span>
      </footer>
    </div>
  );
}
