'use-strict'

function onInit() {
    _createBooks()
    renderFilterByQueryStringParams()
    renderBooks()
    renderModal()
    doTrans()
}

function renderModal() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const bookId = queryStringParams.get('bookId')
    if (!bookId) {
        return
    }

    onReadBook(bookId)
}

function renderNextButton() {
    const elNextBtn = document.querySelector('.next-page-btn')

    const books = getFilteredBooks()

    const pages = Math.ceil(books.length / PAGE_SIZE)
    lastPage = gPageIdx + 1 >= pages

    if (books.length > PAGE_SIZE && !lastPage) {
        elNextBtn.style.display = 'inline'
    } else {
        elNextBtn.style.display = 'none'
    }
}

function renderPrevButton() {
    const firstPage = gPageIdx === 0
    const elPrevBtn = document.querySelector('.prev-page-btn')

    if (!firstPage) {
        elPrevBtn.style.display = 'inline'
    } else {
        elPrevBtn.style.display = 'none'
    }
}

function renderBooks() {
    var books = getBooksForDisplay()
    renderNextButton()
    renderPrevButton()
    var elTableBody = document.querySelector('.books-table-container')
    var strHTMLs = books
        .map(
            (book) => `<tr><td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.price}$</td>
        <td>${book.rate}/10</td>
        <td><img src="${book.imgUrl}.png"width="60"></td>
        <td><button onclick="onReadBook('${book.id}')"
        data-trans="read-book">Read </button></td>
  <td><button onclick="onUpdateBook('${book.id}')"data-trans="update-book">Update</button></td>
  <td><button onclick="onDeleteBook('${book.id}')"data-trans="delete-book">Delete</button></td>
  <td><button onclick="onRateBook('${book.id}')"data-trans="rate-book">Rate</button></td> 
        </tr>`
        )
        .join('')

    elTableBody.innerHTML = strHTMLs
}

function onSearchedBooks(bookName) {
    searchedBooks(bookName)
    renderBooks()
}

function onAddBook() {
    var title = prompt('Book Title ?')
    var price = +prompt('Book Price ?')
    if (title && price) {
        const book = addBook(title, price)
        renderBooks()
        doTrans()
        flashMsg(`Book Added`)
    }
}
function onDeleteBook(bookId) {
    DeleteBook(bookId)
    renderBooks()
    flashMsg(`Book Deleted`)
    doTrans()
}

function onRateBook(bookId) {
    var book = getBookById(bookId)
    var newRate = +prompt('Book Rate ?')
    if (newRate >= 10) {
        newRate = 10
    }
    if (newRate && book.rate !== newRate) {
        book = RateBook(bookId, newRate)
    }
    renderBooks()
    doTrans()
    flashMsg(`Book Rated`)
}

function onIncreaseRate(bookId, newRate) {
    var book = getBookById(bookId)
    if (book.rate === 10) return
    newRate = book.rate + 1
    var elNum = document.querySelector('.rating span')
    book = RateBook(bookId, newRate)
    elNum.innerText = book.rate
    renderBooks()
    flashMsg(`Book Rated`)
}

function onDecreaseRate(bookId, newRate) {
    var book = getBookById(bookId)
    if (book.rate === 0) return
    newRate = book.rate - 1
    var elNum = document.querySelector('.rating span')
    book = RateBook(bookId, newRate)
    elNum.innerText = book.rate
    renderBooks()
    flashMsg(`Book Rated`)
}

function onUpdateBook(bookId) {
    var book = getBookById(bookId)
    const newPrice = +prompt('Price ?')
    if (!newPrice || book.price === newPrice) {
        return
    }

    book = updateBook(bookId, newPrice)
    renderBooks()
    doTrans()
    flashMsg('Book Updated')
}

function onReadBook(bookId) {
    const book = getBookById(bookId)
    const elModal = document.querySelector('.modal')
    elModal.classList.add('open')

    const strRateHTML = `
    <h2>${book.title}</h2>
    <p>${book.description}</p>`

    const updateRateHTML = `<button onclick="onIncreaseRate('${book.id}')"class="increase-btn">+</button>
     <span class="rating"> ${book.rate} </span>
    <button onclick="onDecreaseRate('${book.id}')"class="decrease-btn">-</button>`

    const queryStringParams = `?maxPrice=${gFilterBy.maxPrice}&minRate=${gFilterBy.minRate}&bookId=${bookId}`
    const newUrl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        queryStringParams

    window.history.pushState({ path: newUrl }, '', newUrl)
    const elRate = document.querySelector('.update-rating')
    const elUpdate = document.querySelector('.rating')
    elRate.innerHTML = strRateHTML
    elUpdate.innerHTML = updateRateHTML
    _saveBooksToStorage()
    renderBooks()
    doTrans()
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
    onSetFilterBy(gFilterBy)
    doTrans()
}

function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => {
        el.classList.remove('open')
    }, 3000)
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        maxPrice: +queryStringParams.get('maxPrice') || 0,
        minRate: +queryStringParams.get('minRate') || 0
    }
    var sortBy = queryStringParams.get('sort')
    const priceInput = document.querySelector('.filter-price-res')
    priceInput.value = filterBy.maxPrice
    const rateInput = document.querySelector('.filter-rate-range')
    rateInput.value = filterBy.minRate
    setBookFilter(filterBy)
    onSetSortBy(sortBy)
    _saveBooksToStorage()
}

function updateQueryParams(filterBy) {
    const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}`
    const newUrl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onSetFilterBy(filterBy, elInput, resSelector) {
    filterBy = setBookFilter(filterBy)

    const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}`
    const newUrl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
    gPageIdx = 0
    renderBooks()
    doTrans()
    // elInput.title = elInput.value
    // document.querySelector(resSelector).innerText = elInput.value
    _saveBooksToStorage()
}

function onSetSortBy(sortBy) {
    setSortBy(sortBy)

    renderBooks()
    doTrans()
}

function onNextPage() {
    nextPage()
    renderBooks()
    doTrans()
}

function onPrevPage() {
    prevPage()
    renderBooks()
    doTrans()
}

function onSetLang(lang) {
    var htmlBody = document.querySelector('body')
    if (lang === 'he') {
        htmlBody.classList.add('rtl')
    } else htmlBody.classList.remove('rtl')
    setLang(lang)
    renderBooks()
    doTrans()
}
