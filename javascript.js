const books = [];
const bookChanged = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBuku");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
});

// membuat ID
function generateId() {
  return +new Date();
}

// membuat object
function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year: Number(year),
    isComplete,
  };
}

// menambahkan buku
function addBook() {
  const inputBukuTitle = document.getElementById("inputBukuTitle").value;
  const inputBukuAuthor = document.getElementById("inputBukuAuthor").value;
  const inputBukuYear = document.getElementById("inputBukuYear").value;
  const inputBukuIsComplete = document.getElementById("inputBukuIsComplete");
  if (inputBukuIsComplete.checked == true) {
    const book = generateBookObject(generateId(), inputBukuTitle, inputBukuAuthor, inputBukuYear, true);
    books.push(book);
  } else {
    const book = generateBookObject(generateId(), inputBukuTitle, inputBukuAuthor, inputBukuYear, false);
    books.push(book);
  }

  document.dispatchEvent(new Event(bookChanged));
  saveData();
}

// membuat Item Book
function makeBook(bookObject) {
  const textInputBukuTitle = document.createElement("h2");
  textInputBukuTitle.innerText = bookObject.title;

  const textInputBukuAuthor = document.createElement("p");
  textInputBukuAuthor.innerText = "Penulis : " + bookObject.author;

  const textInputBukuYear = document.createElement("p");
  textInputBukuYear.innerText = "Tahun : " + bookObject.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textInputBukuTitle, textInputBukuAuthor, textInputBukuYear);

  const container = document.createElement("div");
  container.classList.add("item");
  container.append(textContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      undoTask(bookObject.id);
    });

    const sampahButton = document.createElement("button");
    sampahButton.classList.add("sampah-button");
    sampahButton.addEventListener("click", function () {
      deleteTask(bookObject.id);
    });

    container.append(undoButton, sampahButton);
  } else {
    const cekButton = document.createElement("button");
    cekButton.classList.add("cek-button");
    cekButton.addEventListener("click", function () {
      addTaskToComplete(bookObject.id);
    });

    const sampahButton = document.createElement("button");
    sampahButton.classList.add("sampah-button");
    sampahButton.addEventListener("click", function () {
      deleteTask(bookObject.id);
    });

    container.append(cekButton, sampahButton);
  }
  return container;
}

// menampilkan Buku yang tersimpan pada Array.
document.addEventListener(bookChanged, function () {
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  incompleteBookshelfList.innerHTML = "";

  const completeBookshelfList = document.getElementById("completeBookshelfList");
  completeBookshelfList.innerHTML = "";

  for (bookItem of books) {
    const bookElement = makeBook(bookItem);

    if (bookItem.isComplete == false) incompleteBookshelfList.append(bookElement);
    else completeBookshelfList.append(bookElement);
  }
  console.log(books);
});

// menghapus buku
function deleteTask(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);

  document.dispatchEvent(new Event(bookChanged));
  saveData();
}

// mengembalikan buku
function undoTask(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(bookChanged));
  saveData();
}

function findBookIndex(bookId) {
  for (index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

// cek button
function addTaskToComplete(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(bookChanged));
  saveData();
}

function findBook(bookId) {
  for (bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

// search buku
function searchBook() {
  const searchBookTitle = document.getElementById("searchBookTitle");
  const filterBook = searchBookTitle.value.toLowerCase();
  const bookItem = document.getElementsByClassName("item");

  for (let i = 0; i < bookItem.length; i++) {
    const title = bookItem[i].getElementsByTagName("h2")[0];
    if (title.innerHTML.toLowerCase().indexOf(filterBook) > -1) {
      bookItem[i].style.display = "";
    } else {
      bookItem[i].style.display = "none";
    }
  }
}

// penyimpanan data
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Maaf, browser kamu tidak mendukung local storage!");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(bookChanged));
}

document.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
