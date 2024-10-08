class NotesList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    fetch("components/NotesList/styles.css")
      .then((response) => response.text())
      .then((css) => {
        const style = document.createElement("style");
        style.textContent = css;
        this.shadowRoot.appendChild(style);
      });

    this.render();
  }

  getNotes() {
    return JSON.parse(localStorage.getItem("notes")) || [];
  }

  render() {
    const container = document.createElement("div");
    container.classList.add("notes-list-container");

    this.newNoteForm = document.createElement("add-new-note");
    this.newNoteForm.style.display = "none";
    container.appendChild(this.newNoteForm);

    const notes = this.getNotes();

    if (notes.length > 0) {
      this.addNewNoteBtn = this.createAddNewNoteButton();
      container.appendChild(this.addNewNoteBtn);

      notes.forEach((note) => {
        const noteElement = this.createNoteElement(note);
        container.appendChild(noteElement);
      });
    } else {
      this.emptyList = document.createElement("empty-list");
      container.appendChild(this.emptyList);
    }

    this.shadowRoot.appendChild(container);
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
    return noteElement;
  }
}

customElements.define("notes-list", NotesList);
