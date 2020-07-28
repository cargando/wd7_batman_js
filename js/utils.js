


document.getElementById('searchButton').addEventListener('click', searchShow);

document.getElementById('viewType').addEventListener('click', function (e) {

  const table = document.getElementById('showList')
  const cards = document.getElementById('cardsList')

  if (this.checked) { // если переключатель показывает на карточки, тогда
    cards.style.display = 'block'; // показать карточки
    table.style.display = 'none'; // скрыть таблицу
  } else { // в противном случае наоборот
    cards.style.display = 'none'; // скрыть карточки
    table.style.display = 'table'; // показать таблицу
  }

  console.log('checkbox', )

})





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
    renderTable(data);
    console.log('DATA from SERVER:', data)
  });

}


function getSearchText() {
  return document.getElementById('searchText').value;
}


function createTableRecord(item, index) {
  const { genres, id, name, premiered, status } = item;

  const tr = document.createElement('tr');  // создать html тег - TR

  const helper = (textPrimary, textSecondary = null) => {
    const td = document.createElement('td'); // создать html тег - TD
    td.innerHTML = textPrimary; // вставить текстовые данные внутрь ячейки
    tr.appendChild(td); // прикрепить ячейку внутрь строки таблицы

    if (textSecondary !== null) {
      const small = document.createElement('small'); // создать html тег - SMALL
      small.innerText = ` (${ textSecondary })`;
      small.classList.add('text-muted');
      td.appendChild(small);
    }

  }

  helper(index);
  helper(name, id)
  helper(premiered)
  helper(status)
  helper(genres.join(', '))

  tr.setAttribute('data-id', id);
  return tr;
}

function renderTable(list) {

  const table = document.getElementById('showList');
  const tBody = table.querySelector('tbody');

  list.forEach((item, index) => {
    const child = createTableRecord(item.show, index);
    tBody.appendChild(child);
  });
}



/*
<tr>
					<th scope="row">1</th>
					<td>Mark</td>
					<td>Otto</td>
					<td>@mdo</td>
				</tr>

 */
