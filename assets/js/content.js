/**
 * FEATURES
 * 
 * 1. Keep/unkeep quote
 * 2. Always have quote to show except the first time run app.
 * - Store at least 3 quotes, check quotes length every first start of each day.
 * - Run in background to fetch more quote if it less than 3 quotes
 */

const quoteURL = 'https://trichhay.herokuapp.com/quote';
const quoteKey = '_q';
const stateKey = '_s';

function setStorage(key, value) {
  if (!key || !value) throw Error('Key or value not valid');

  window.localStorage.setItem(key, JSON.stringify(value))
}

function getStorage(key) {
  if (!key) throw Error('Key not found');

  const result = window.localStorage.getItem(key);
  return result && JSON.parse(result) || undefined;
}

// TODO: Impl proxy
const state = {
  addQuote: function (quote) {
    const existed = this.quotes.findIndex(q => q.id === quote.id) > -1;
    if (existed) return;

    this.quotes.push(quote);
    setStorage(stateKey, { quotes: this.quotes })
  },
  quotes: [
    {
      id: '5caab8ce9e355b10d024da6b',
      quoteBody: 'Đừng bao giờ nhìn lại phía sau khi bạn đang đi đến thành công nhưng đừng quên nhìn lại quá khứ khi đã đạt được nó.',
      author: 'Khuyết danh',
      fetchedDate: undefined,
      isKept: false,
      keepDate: undefined,
    }
  ]
}

function getQuoteRequest() {
  return new Promise((resolve, reject) => {
    fetch(quoteURL).then(res => res.json()).then(res => {
      if (!res.success) {
        reject('Cannot load the quote');
      }

      const quote = {
        id: res.data._id,
        quoteBody: res.data.quote,
        author: res.data.author,
        fetchedDate: new Date(),
        isKept: false,
        keepDate: undefined,
      };
      resolve(quote);
    }).catch(error => {
      console.error(error);
    })
  })
}

function getTextRemovedPunctuation(text) {
  return text.replace(/\.$/, '');
}

function getKeepingQuote() {
  const quote = getStorage(quoteKey);
  if (quote?.isKept) {
    // TODO: check is valid expired date to show
  }
  return undefined;
}

function getQuoteSentence(quote) {
  if (quote.author)
    return `“${getTextRemovedPunctuation(quote.quoteBody)}” - ${quote.author}`
  else
    return `“${getTextRemovedPunctuation(quote.quoteBody)}”`
}

function showQuote(text) {
  const quoteEl = document.getElementById('quote');
  quoteEl.innerText = text;
}

function showQuoteSentence(quote) {
  showQuote(getQuoteSentence(quote));
}

Date.prototype.addDays = function addDays(dayCount) {
  this.setDate(this.getDate() + dayCount);
}

function onKeepQuote() {

}

function onUnKeepQuote() {

}

// JQUERY
$(document).ready(function () {
  // 1. Show the keeping quote from localStorage, if there's have no quote, get from server
  const quote = getKeepingQuote();
  if (quote) {
    // 2. Show on UI
    showQuoteSentence(quote);
  } else {
    showQuote('Loading quote...');
    getQuoteRequest().then(quote => {
      state.addQuote(quote);
      showQuoteSentence(quote);
    }).catch(error => {
      console.error(error);
    });
  }
});