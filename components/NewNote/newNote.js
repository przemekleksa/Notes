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
  }

  insertFields() {
    const container = this.shadowRoot.querySelector(".newNote");
    if (container) {
      const inputField = document.createElement("note-input-field");
      const textareaField = document.createElement("note-textarea-field");
      const saveBtn = this.shadowRoot.querySelector("#save");

      container.insertBefore(inputField, saveBtn);
      container.insertBefore(textareaField, saveBtn);

      saveBtn.addEventListener("click", () => {
        const title = inputField.value;
        const content = textareaField.value;
        if (title && content) {
          const noteId = Math.floor(Math.random() * 1000000 + 1);
          this.saveNote({ title, content, noteId });
          inputField.value = "";
          textareaField.value = "";
          this.removeNewNoteForm();
        } else {
          alert("Please fill in both fields.");
        }
      });
    }
  }

  saveNote(note) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  removeNewNoteForm() {
    this.remove();
  }
}

customElements.define("add-new-note", NewNote);
