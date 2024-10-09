class NewNote extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    fetch("components/NewNote/styles.css")
      .then((response) => response.text())
      .then((css) => {
        const style = document.createElement("style");
        style.textContent = css;
        this.shadowRoot.appendChild(style);
      });

    fetch("components/NewNote/template.html")
      .then((response) => response.text())
      .then((html) => {
        this.shadowRoot.innerHTML += html;
        this.insertFields();
      });

    this.isEditMode = false;
    this.noteId = null;
  }

  insertFields() {
    const container = this.shadowRoot.querySelector(".newNote");
    if (container) {
      const inputField = document.createElement("note-input-field");
      const textareaField = document.createElement("note-textarea-field");
      const saveBtn = this.shadowRoot.querySelector("#save");
      const cancelBtn = this.shadowRoot.querySelector("#cancel");

      container.insertBefore(inputField, saveBtn);
      container.insertBefore(textareaField, saveBtn);

      this.error = document.createElement("div");
      this.error.style.color = "#ff0000";
      this.error.style.textAlign = "center";
      this.error.style.display = "none";
      container.insertBefore(this.error, saveBtn);

      const saveNote = () => {
        const title = inputField.value;
        const content = textareaField.value;

        if (title && content) {
          const timestamp = Date.now();

          if (this.isEditMode) {
            this.updateNote({ title, content, noteId: this.noteId, timestamp });
          } else {
            const noteId = Math.floor(Math.random() * 1000000 + 1);
            this.saveNote({ title, content, noteId, timestamp });
          }

          inputField.value = "";
          textareaField.value = "";
          this.hideNewNoteForm();
        } else {
          this.error.textContent = "Please fill in both fields";
          this.error.style.display = "block";
        }
      };

      saveBtn.addEventListener("click", saveNote);

      textareaField.addEventListener("save-note", saveNote);
      inputField.addEventListener("save-note", saveNote);

      [inputField, textareaField].forEach((field) => {
        field.addEventListener("input", () => {
          if (inputField.value && textareaField.value) {
            this.error.style.display = "none";
          }
        });
      });

      cancelBtn.addEventListener("click", () => {
        inputField.value = "";
        textareaField.value = "";
        this.error.style.display = "none";
        this.hideNewNoteForm();
      });
    }
  }

  getNotes() {
    return JSON.parse(localStorage.getItem("notes")) || [];
  }

  saveNote(note) {
    const notes = this.getNotes();
    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));

    const notesList = document.querySelector("notes-list");
    if (notesList) {
      notesList.render();
    }
  }

  updateNote(updatedNote) {
    const notes = this.getNotes();
    const noteIndex = notes.findIndex(
      (note) => note.noteId === updatedNote.noteId
    );
    if (noteIndex !== -1) {
      notes[noteIndex] = updatedNote;
      localStorage.setItem("notes", JSON.stringify(notes));

      const notesList = document.querySelector("notes-list");
      if (notesList) {
        notesList.render();
      }
    }
  }

  setNoteData({ title, content, noteId }) {
    this.isEditMode = true;
    this.noteId = noteId;

    const inputField = this.shadowRoot.querySelector("note-input-field");
    const textareaField = this.shadowRoot.querySelector("note-textarea-field");

    inputField.value = title;
    textareaField.value = content;

    this.error.style.display = "none";
  }

  hideNewNoteForm() {
    this.shadowRoot.host.style.display = "none";
    const notesList = document.querySelector("notes-list");
    if (notesList) {
      notesList.showAddNewButton();
      const notes = notesList.getNotes();
      if (notes.length === 0) {
        const emptyList = document.createElement("empty-list");
        notesList.container.appendChild(emptyList);
      }
    }
  }
}

customElements.define("add-new-note", NewNote);
