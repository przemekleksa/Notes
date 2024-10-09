class NotesList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.loadStyles();

    this.container = document.createElement("div");
    this.container.classList.add("notes-list-container");
    this.shadowRoot.appendChild(this.container);

    this.render();
  }

  async loadStyles() {
    const response = await fetch("components/NotesList/styles.css");
    const css = await response.text();
    const style = document.createElement("style");
    style.textContent = css;
    this.shadowRoot.appendChild(style);
  }

  getNotes() {
    return JSON.parse(localStorage.getItem("notes")) || [];
  }

  render() {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }

    this.newNoteForm = document.createElement("add-new-note");
    this.newNoteForm.style.display = "none";
    this.container.appendChild(this.newNoteForm);

    const notes = this.getNotes();

    if (notes.length > 0) {
      this.addNewNoteBtn = this.createAddNewNoteButton();
      this.container.appendChild(this.addNewNoteBtn);

      notes.forEach((note) => {
        const noteElement = this.createNoteElement(note);
        this.container.appendChild(noteElement);
      });
    } else {
      this.emptyList = document.createElement("empty-list");
      this.container.appendChild(this.emptyList);
    }
  }

  createAddNewNoteButton() {
    const addNewNoteBtn = document.createElement("custom-button");
    addNewNoteBtn.setAttribute("secondary", "");
    addNewNoteBtn.setAttribute("label", "Add New");
    addNewNoteBtn.setAttribute("fullwidth", "");
    addNewNoteBtn.addEventListener("click", () => this.showNewNoteForm());
    return addNewNoteBtn;
  }

  showNewNoteForm() {
    if (this.emptyList) {
      this.emptyList.remove();
    }

    this.addNewNoteBtn.style.display = "none";
    this.newNoteForm.style.display = "block";
  }

  showAddNewButton() {
    this.newNoteForm.style.display = "none";
    if (this.addNewNoteBtn) {
      this.addNewNoteBtn.style.display = "block";
    }
  }

  createNoteElement(note) {
    const noteElement = document.createElement("note-element");
    noteElement.setAttribute("title", note.title);
    noteElement.setAttribute("content", note.content);
    noteElement.setAttribute("id", note.noteId);
    noteElement.setAttribute("timestamp", note.timestamp);

    noteElement.editNoteCallback = () => this.editNote(note);
    noteElement.removeNoteCallback = () => this.confirmDeleteNote(note);

    return noteElement;
  }

  editNote(note) {
    if (this.emptyList) {
      this.emptyList.remove();
    }

    this.newNoteForm.style.display = "block";
    this.newNoteForm.setNoteData(note);
    this.addNewNoteBtn.style.display = "none";
  }

  confirmDeleteNote(note) {
    this.showDeleteModal(note);
  }

  showDeleteModal(note) {
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");
    overlay.addEventListener("click", () => this.hideDeleteModal(overlay));

    const modal = document.createElement("div");
    modal.classList.add("modal");

    const title = document.createElement("h2");
    title.textContent = "Delete Note";

    const subtitle = document.createElement("p");
    subtitle.textContent = "Are you sure you want to delete this note?";

    const buttons = document.createElement("div");
    buttons.classList.add("buttons");

    const cancelButton = this.createModalButton("Cancel", () =>
      this.hideDeleteModal(overlay)
    );
    cancelButton.setAttribute("tertiary", "");
    cancelButton.setAttribute("fullwidth", "");
    cancelButton.classList.add("cancelBtn");

    const deleteButton = this.createModalButton("Delete", () => {
      this.removeNote(note);
      this.hideDeleteModal(overlay);
    });
    deleteButton.setAttribute("secondary", "");
    deleteButton.setAttribute("fullwidth", "");
    deleteButton.classList.add("deleteBtn");

    buttons.appendChild(cancelButton);
    buttons.appendChild(deleteButton);

    modal.appendChild(title);
    modal.appendChild(subtitle);
    modal.appendChild(buttons);
    overlay.appendChild(modal);

    this.shadowRoot.appendChild(overlay);
  }

  createModalButton(label, onClick) {
    const button = document.createElement("custom-button");
    button.setAttribute("label", label);
    button.setAttribute("fullwidth", "");
    button.addEventListener("click", onClick);
    return button;
  }

  hideDeleteModal(overlay) {
    overlay.remove();
    const modal = this.shadowRoot.querySelector(".modal");
    if (modal) {
      modal.remove();
    }
  }

  removeNote(note) {
    const notes = this.getNotes();
    const newNotes = notes.filter(
      (noteItem) => noteItem.noteId !== note.noteId
    );
    localStorage.setItem("notes", JSON.stringify(newNotes));
    this.render();
  }
}

customElements.define("notes-list", NotesList);
