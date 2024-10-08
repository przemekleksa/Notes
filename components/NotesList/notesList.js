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
    addNewNoteBtn.setAttribute("secondary", true);
    addNewNoteBtn.setAttribute("label", "Add New");
    addNewNoteBtn.setAttribute("fullWidth", true);
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
}

customElements.define("notes-list", NotesList);
