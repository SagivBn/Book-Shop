'use strict'

var gTrans = {
    title: {
        en: 'Books Shop',
        he: 'חנות ספרים'
    },
    'not-found': {
        en: 'Book not found',
        he: 'ספר לא נמצא'
    },
    'placeholder-search': {
        en: 'Search for a book name',
        he: 'חפש ספר לפי שם'
    },
    'price-filter': {
        en: 'Max Price',
        he: 'מחיר מקסימלי'
    },
    'rate-filter': {
        en: 'Min Rate',
        he: 'דירוג מינימלי'
    },
    'add-book': {
        en: 'Add Book',
        he: 'הוסף ספר'
    },
    'prev-page': {
        en: 'Previous Page',
        he: 'דף קודם'
    },

    'next-page': {
        en: 'Next Page',
        he: 'דף הבא'
    },
    'book-id': {
        en: 'Id',
        he: 'מספר סידורי'
    },
    'book-title': {
        en: 'Book Title',
        he: 'שם הספר'
    },
    'book-price': {
        en: 'Price',
        he: 'מחיר'
    },
    'rate-book': {
        en: 'Rate',
        he: 'דירוג'
    },
    'book-img': {
        en: 'Book Image',
        he: 'תמונת הספר'
    },
    'book-actions': {
        en: 'Action',
        he: 'פעולות'
    },
    'modal-book-title': {
        en: 'Book Title',
        he: 'מחיר הספר'
    },
    'modal-book-description': {
        en: 'Book Description',
        he: 'תיאור הספר'
    },
    'close-modal': {
        en: 'Close',
        he: 'סגור'
    },
    'read-book': {
        en: 'Read',
        he: 'קרא'
    },
    'update-book': {
        en: 'Update',
        he: 'עדכן'
    },
    'delete-book': {
        en: 'Delete',
        he: 'מחק'
    },
    'rate-book': {
        en: 'Rate',
        he: 'דירוג'
    },
    'update-rating': {
        en: 'Update the book rating',
        he: 'דרג את ציון הספר'
    }
}

var gCurrLang = 'en'
function getTrans(transKey) {
    // if key is unknown return 'UNKNOWN'
    const key = gTrans[transKey]

    if (!key) return 'UNKNOWN'
    // get from gTrans
    // If translation not found - use english
    let translateStr = key[gCurrLang] ? key[gCurrLang] : key['en']
    return translateStr
}

function doTrans() {
    // TODO:
    // var els = document.querySelectorAll('[data-trans]'
    const els = document.querySelectorAll('[data-trans]')
    els.forEach((el) => {
        const transKey = el.dataset.trans
        const translateVal = getTrans(transKey)

        if (typeof el.placeholder === 'string') el.placeholder = translateVal
        else el.innerText = translateVal
    })
}

function formatNumOlder(num) {
    return num.toLocaleString('es')
}

function formatNum(num) {
    return new Intl.NumberFormat(gCurrLang).format(num)
}

function formatCurrency(num) {
    return new Intl.NumberFormat('he-IL', {
        style: 'currency',
        currency: 'ILS'
    }).format(num)
}

function formatDate(time) {
    var options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }

    return new Intl.DateTimeFormat(gCurrLang, options).format(time)
}

function setLang(lang) {
    gCurrLang = lang
}

function kmToMiles(km) {
    return km / 1.609
}
