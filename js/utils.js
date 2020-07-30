
const STATE = {
  timer: null,
  customEventSwitch: new Event("customEventSwitch", {bubbles: true}),
}



document.getElementById('searchText').addEventListener('keypress', waitUserInput)

document.getElementById('searchButton').addEventListener('click', searchShow);
document.getElementById('viewType').addEventListener('click', handleViewTypeClick)

document.getElementById('pageContainer').addEventListener("customEventSwitch", handleChangeHeader)


function handleChangeHeader(e) {
  document.getElementById('headerShowText').innerText = document.getElementById('searchText').value;
  console.log("customEventSwitch:: ", e);
}

function handleViewTypeClick() {


  const res  = document.getElementById('searchText').dispatchEvent(STATE.customEventSwitch);
  console.log("res:: ", res);

  changeVeiw(this.checked);
}



function changeVeiw(status) {
  const table = document.getElementById('showList')
  const cards = document.getElementById('cardsList')

  if (status) { // если переключатель показывает на карточки, тогда
    cards.style.display = 'block'; // показать карточки
    table.style.display = 'none'; // скрыть таблицу
  } else { // в противном случае наоборот
    cards.style.display = 'none'; // скрыть карточки
    table.style.display = 'table'; // показать таблицу
  }

  console.log('checkbox', )

}

function waitUserInput() {
  const searchText = document.getElementById('searchText');

  console.log("TEXT len = ", searchText.value.length, searchText.value)

  if (STATE.timer) {
    clearTimeout(STATE.timer);
    STATE.timer = null
  }
  STATE.timer = setTimeout(() => {
    const text = searchText.value;
    if (text.length < 3) {
      return ;
    }

    console.log("Юзер ввел: ", text);
    searchShow();
  }, 300);

}



function searchShow() {

  const text = getSearchText().trim();
  if (!text.length) {
    return;
  }

  const fetchResult = fetch(`https://api.tvmaze.com/search/shows?q=${ text }`);

  fetchResult.then(response => {
    console.log('DATA from SERVER:', response);
    return response.json();
  }).then( data => {
    // получили данные с сервака
    console.log('DATA from SERVER:', data);
    if (data.message) {
      return ;
    }
    renderTable(data);
    renderAllCards(data);

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

  tBody.innerHTML = '';

  list.forEach((item, index) => {
    const child = createTableRecord(item.show, index);
    tBody.appendChild(child);
  });
}


function renderOneCard(item) {

  const divContainer = document.createElement('div');
  const image = document.createElement('img');

  divContainer.classList.add('card');

  image.classList.add('card-img-top');
  if (item.image) {
    image.setAttribute('src', item.image.medium);
  }

  const divCardBody = document.createElement('div');
  divCardBody.classList.add('card-body');

  const h5 = document.createElement('h5');
  const p = document.createElement('p');
  const a = document.createElement('a');

  h5.classList.add('card-title');
  p.classList.add('card-text');
  a.classList.add('btn', 'btn-primary');

  divContainer.appendChild(image);
  divContainer.appendChild(divCardBody);

  divCardBody.appendChild(h5);
  divCardBody.appendChild(p);
  divCardBody.appendChild(a);

  h5.innerText = item.name;
  p.innerText = stripHtml(item.summary).substr(0, 120) + '...';
  a.innerText = 'Подробнее';
  a.setAttribute('href', '#');

  return divContainer;
}

function renderAllCards(list) {
  const container = document.getElementById('cardsList');
  container.innerHTML = '';

  const msCards = list.map((item) => renderOneCard(item.show));

  let msHelper = [];

  function createRow() {
    const row = document.createElement('div');
    row.classList.add('row');
    row.style.marginBottom = '15px';
    return row;
  }

  function createCell(child) {
    const cell = document.createElement('div');
    cell.classList.add('col-sm-4');
    console.log('createCell >>> ', child);
    cell.appendChild(child);
    return cell;
  }

  function combineCells(list) {
    const row = createRow();
    list.forEach(item => row.appendChild(createCell(item)));
    container.appendChild(row);
  }


  for(let i = 0; i < msCards.length; i++) {
    msHelper.push( msCards[i] );

    if (msHelper.length === 3) {
      combineCells(msHelper);
      msHelper = [];
    }
  }
  console.log('After FOR', msHelper);
  if (msHelper.length) {
    combineCells(msHelper);
    msHelper = [];
  }

}

function stripHtml(html)
{
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

/*
<tr>
					<th scope="row">1</th>
					<td>Mark</td>
					<td>Otto</td>
					<td>@mdo</td>
				</tr>

 */
