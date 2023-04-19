const API_URL = 'http://openlibrary.org/search.json?q=';

$(document).ready(() => {
  $('#inputForm').on('submit', handleFormSubmit);
});

async function handleFormSubmit(event) {
  event.preventDefault();

  const input = document.getElementById('searchInput').value;

  const query = `${API_URL}${input}`;

  try {
    setResultMessage(`<h4 style="color: #27ae60;">Loading...</h4>`);
    const response = await fetch(query);
    const data = await response.json();

    if (data.numFound === 0) {
      setResultMessage('No results found.');
      return;
    }

    const books = data.docs || [];
    displayBooks(books);
  } catch (error) {
    setResultMessage('An error occurred while searching for books.');
    console.error(error);
  }
}


function setResultMessage(message) {
  $('#resultContainer').html(`<p class="warning">${message}</p>`);
}

function displayBooks(books) {
  const container = $('#resultContainer');
  container.empty();

  if (!Array.isArray(books)) {
    setResultMessage('Invalid data received from server.');
    return;
  }

  for (let book of books) {
    const title = book.title;
    const author = book.author_name ? book.author_name.join(', ') : 'Unknown';
    const thumbnail = book.cover_i ? `http://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 'https://cdn.pixabay.com/photo/2021/07/21/12/49/error-6482984_1280.png';
    const isbn = book.isbn ? book.isbn[0] : 'Unknown';
    const key = book.key;
    
    const bookHtml = `
      <div class="book-card" onclick="openBook('${key}')">
        <div class="book-thumbnail">
          <img src="${thumbnail}">
        </div>
        <div class="book-details">
          <h3>${title}</h3>
          <p><b style="margin-right: 13px;">Author: </b>${author}</p>
          <p><b style="margin-right: 25px;">ISBN: </b>${isbn}</p>
          <p style="text-align: center;">💡 click on book card for details</p>
        </div>
      </div>
    `;
    container.append(bookHtml);
  }
}

function openBook(key) {
  window.open(`https://openlibrary.org${key}`);
}