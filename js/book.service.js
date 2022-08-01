'use-strict'
const STORAGE_KEY = 'bookDB'
var gSortDirection = 1
var gBooks
var gFilterBy = { maxPrice: 300, minRate: 1, bookId: '', page: 0 }
const PAGE_SIZE = 5
var gPageIdx = 0
var lastPage = true

function nextPage() {
    gPageIdx++
}

function prevPage() {
    gPageIdx--
}

const gDefaultBooks = [
    {
        id: makeId(),
        title: 'Harry Potter',
        price: 50,
        rate: 3,
        imgUrl: `img/book${getRandomIntInclusive(1, 11)}`,
        description: makeLorem()
    },
    {
        id: makeId(),
        title: 'Israel History',
        price: 100,
        rate: 5,
        imgUrl: `img/book${getRandomIntInclusive(1, 11)}`,
        description: makeLorem()
    },
    {
        id: makeId(),
        title: 'Lord Of The Rings',
        price: 150,
        rate: 7,
        imgUrl: `img/book${getRandomIntInclusive(1, 11)}`,
        description: makeLorem()
    }
]

function _createBook(title, price = getRandomIntInclusive(3, 30), rate = 1) {
    return {
        id: makeId(),
        title: title,
        price: price,
        rate: rate,
        imgUrl: `img/book${getRandomIntInclusive(1, 11)}`,
        description: makeLorem()
    }
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)

    // Nothing in storage - generate demo data
    if (!books || !books.length) {
        books = gDefaultBooks
    }
    gBooks = books
    _saveBooksToStorage()
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function getBookById(bookId) {
    const book = gBooks.find((book) => bookId === book.id)
    return book
}

function updateBook(bookId, newPrice) {
    const book = gBooks.find((book) => book.id === bookId)
    book.price = newPrice
    _saveBooksToStorage()
    return book
}

function addBook(title, price) {
    const book = _createBook(title, price)
    gBooks.unshift(book)
    _saveBooksToStorage()
    return book
}

function DeleteBook(bookId) {
    const bookIdx = gBooks.findIndex((book) => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function RateBook(bookId, newRate) {
    const book = gBooks.find((book) => book.id === bookId)
    book.rate = newRate
    _saveBooksToStorage()
    return book
}

function setBookFilter(filterBy = {}) {
    if (filterBy.maxPrice !== undefined) {
        gFilterBy.maxPrice = filterBy.maxPrice
    }
    if (filterBy.minRate !== undefined) {
        gFilterBy.minRate = filterBy.minRate
    }
    if (filterBy.bookId !== undefined) {
        gFilterBy.bookId = filterBy.bookId
    }
    if (filterBy.page !== undefined) {
        gFilterBy.page = filterBy.page
    }
    return gFilterBy
}

function getFilteredBooks() {
    return gBooks.filter(
        (book) =>
            book.price <= gFilterBy.maxPrice && book.rate >= gFilterBy.minRate
    )
}

function getBooksForDisplay() {
    var books = getFilteredBooks()
    const startIdx = gPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)
    return books
}

function searchedBooks(searchInput) {
    gBooks = loadFromStorage(STORAGE_KEY)
    const books = []
    gBooks.forEach((book) => {
        if (book.title.toUpperCase().includes(searchInput.toUpperCase())) {
            books.push(book)
        }
    })

    if (!books.length) {
        document.querySelector('.not-found').hidden = false
        gBooks = loadFromStorage(STORAGE_KEY)
    } else {
        gBooks = books
        document.querySelector('.not-found').hidden = true
    }
}

function setSortBy(sortBy) {
    if (gSortDirection === 1) {
        gSortDirection = -1
    } else gSortDirection = 1

    if (sortBy === 'name') {
        gBooks.sort(
            (book1, book2) =>
                book1.title.localeCompare(book2.title) * gSortDirection
        )
    } else if (sortBy === 'price') {
        gBooks.sort(
            (book1, book2) => (book1.price - book2.price) * gSortDirection
        )
    }
}
