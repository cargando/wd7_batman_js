


document.getElementById('searchButton').addEventListener('click', searchShow);

function searchShow() {

  const text = getSearchText().trim();
  if (!text.length) {
    return;
  }

  const fetchResult = fetch(`https://api.tvmaze.com/search/shows?q=${ text }`);

  fetchResult.then(response => {
    return response.json();
  }).then( data => {
    // получили данные с сервака
    console.log('DATA from SERVER:', data)
  });

}


function getSearchText() {
  return document.getElementById('searchText').value;
}
