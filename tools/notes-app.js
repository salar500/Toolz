export function renderNotesApp(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>New Note</label>
      <textarea id="note_input" rows="3" style="width:100%" placeholder="Write your note here..."></textarea>
    </div>
    <button id="note_add" class="btn" style="margin-top:6px">
      Add Note
    </button>

    <p class="small muted" style="margin-top:8px">
      Your notes are saved in your browser (localStorage).
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Notes</div>
      <div id="notes_list" style="margin-top:10px">
        No notes yet
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const inputEl = document.querySelector('#note_input');
  const addBtn = document.querySelector('#note_add');
  const notesListEl = document.querySelector('#notes_list');

  /* ---------------- LOGIC ---------------- */
  function getNotes() {
    return JSON.parse(localStorage.getItem('notesAppNotes') || '[]');
  }

  function saveNotes(notes) {
    localStorage.setItem('notesAppNotes', JSON.stringify(notes));
  }

  function renderNotes() {
    const notes = getNotes();

    if (!notes.length) {
      notesListEl.innerHTML = 'No notes yet';
      return;
    }

    notesListEl.innerHTML = '';
    notes.forEach((note, index) => {
      const noteDiv = document.createElement('div');
      noteDiv.style.border = '1px solid #ccc';
      noteDiv.style.borderRadius = '6px';
      noteDiv.style.padding = '6px';
      noteDiv.style.marginBottom = '6px';
      noteDiv.style.position = 'relative';

      noteDiv.innerHTML = `
        <div style="white-space:pre-wrap">${note}</div>
        <div style="position:absolute;top:6px;right:6px;display:flex;gap:4px">
          <button class="note_edit btn small">Edit</button>
          <button class="note_delete btn small">Delete</button>
        </div>
      `;

      notesListEl.appendChild(noteDiv);

      // Edit
      noteDiv.querySelector('.note_edit').addEventListener('click', () => {
        const newText = prompt('Edit note:', note);
        if (newText !== null) {
          notes[index] = newText;
          saveNotes(notes);
          renderNotes();
        }
      });

      // Delete
      noteDiv.querySelector('.note_delete').addEventListener('click', () => {
        if (confirm('Delete this note?')) {
          notes.splice(index, 1);
          saveNotes(notes);
          renderNotes();
        }
      });
    });
  }

  function addNote() {
    const text = inputEl.value.trim();
    if (!text) return alert('Cannot add empty note');

    const notes = getNotes();
    notes.push(text);
    saveNotes(notes);
    inputEl.value = '';
    renderNotes();
  }

  /* ---------------- EVENTS ---------------- */
  addBtn.addEventListener('click', addNote);

  // Initial render
  renderNotes();
}
