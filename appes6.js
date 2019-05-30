class Book {
  constructor(title,author,isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {

  //Adding addBookToTable function to prototype.
  addBookToList(book) {
      const list = document.querySelector('#book-list');
      //Create row for book
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
      `;
      list.appendChild(row);
    }

    //Clear UI fields
    clearFields() {
      document.querySelector('#title').value = '';
      document.querySelector('#author').value = '';
      document.querySelector('#isbn').value = '';
    }

    //Delete book
    deleteBook(target) {
      if(target.className === 'delete'){
        target.parentElement.parentElement.remove();
      }
    }

    //Show alert on UI
    showAlert(msg, className) {
      //create a div
      const div = document.createElement('div');
      div.className = `alert ${className}`;
      div.appendChild(document.createTextNode(msg));
      //Inser this error div into DOM.
      //Get parent element and add this div
      const  container = document.querySelector('.container');
      const form = document.querySelector('.book-form');
      //Adding error div in container before form.
      container.insertBefore(div,form);
      setTimeout(function(){
        document.querySelector('.alert').remove()
      },3000);

    }
}

//Local storage class
class BookStorage {

  static getBooks() {
    console.log('getBooks');
    let books;
    if (localStorage.getItem('books') === null) {
        books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static displayBooks() {
    console.log('displayBooks');
    const books = BookStorage.getBooks();
    const ui = new UI();
    books.forEach(book => {
      ui.addBookToList(book);
    });
  }
  static addBook(book) {
    console.log('addBook');
    const books = BookStorage.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = BookStorage.getBooks();
    books.forEach((book,index) => {
      if(book.isbn === isbn){
        books.splice(index,1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }

}

//DOM Load Event
document.addEventListener('DOMContentLoaded', BookStorage.displayBooks);

//UI Elements
const bookForm = document.querySelector('.book-form');

//Adding listener to submit button
bookForm.addEventListener('submit',addNewBook);

function addNewBook(e) {
  //Get form values
  const title = document.querySelector('#title').value,
        author = document.querySelector('#author').value,
        isbn = document.querySelector('#isbn').value;
  console.log("Values: ", title,author,isbn);

  //Instantiating a book
  const book = new Book(title, author, isbn);
  console.log("Book :", book);

  //Instantiating a UI object
  const ui = new UI();
  //Validate
  if (title === '' || author === '' || isbn === '') {
    //Error alert
    ui.showAlert("Please fill in all fields.","error");
  } else {
    //Add book to list
    ui.addBookToList(book);
    //Store book in local storage.
    BookStorage.addBook(book);
    ui.showAlert(`Book ${title} has been added`,"success");
    ui.clearFields();
  }
  e.preventDefault();
}

//Event listener for delete book
//When something is repeaded multiple times having same class or
//something gets added to DOM dynamically, it was not there on page load,
//We use event delegation in such cases and we add event listener on parents.
document.getElementById('book-list').addEventListener('click',function(e){
  //Instantiating a UI object
  const ui = new UI();
  ui.deleteBook(e.target);
  BookStorage.removeBook(e.target.parentElement.previousElementSibling.textContent)
  ui.showAlert("Book removed!","success");
 e.preventDefault();
});