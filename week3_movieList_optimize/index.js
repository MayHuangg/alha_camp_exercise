const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = [] //電影總清單
const MOVIES_PER_PAGE = 12
let filteredMovies = []
let onWhichPage = 1
let list //render用的電影陣列 movies or filteredMovies
const genresObject = {
  "1": "Action",
  "2": "Adventure",
  "3": "Animation",
  "4": "Comedy",
  "5": "Crime",
  "6": "Documentary",
  "7": "Drama",
  "8": "Family",
  "9": "Fantasy",
  "10": "History",
  "11": "Horror",
  "12": "Music",
  "13": "Mystery",
  "14": "Romance",
  "15": "Science Fiction",
  "16": "TV Movie",
  "17": "Thriller",
  "18": "War",
  "19": "Western"
}

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const showInCardBtn = document.querySelector('#show-in-card-btn')
const showInListBtn = document.querySelector('#show-in-list-btn')
const genresDropdownBtn = document.querySelector('#genres-dropdown-btn')

// data:準備render的資料陣列，以卡片的樣式render
function renderMovieListInCard(data) {
  let rawHTML = ''
  data.forEach((item) => {
    // title, image, id
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${POSTER_URL + item.image
      }" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button 
            class="btn btn-primary 
            btn-show-movie" 
            data-bs-toggle="modal" 
            data-bs-target="#movie-modal" 
            data-id="${item.id}"
          >
            More
          </button>
          <button 
            class="btn btn-info btn-add-favorite" 
            data-id="${item.id}"
          >
            +
          </button>
        </div>
      </div>
    </div>
  </div>`
  })
  dataPanel.innerHTML = rawHTML
}

// data:準備render的資料陣列，以list的樣式render
function renderMovieListInList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `<ul class="list-group list-group-flush ps-0">
      <li class="list-group-item row d-flex align-items-center">
        <div class="col-9 ps-0 ">${item.title}</div>
        <div class="btns-container col-3 d-flex p-1">
        
          <button class="btn btn-primary btn-show-movie me-1" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More
          </button>
        
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}"> +
          </button> 
        </div>           
      </li>`
  })
  dataPanel.innerHTML = rawHTML
}


//如果這裡的page用onWhickPage不知道會怎樣
function renderMovieList (moviesArray,page,renderInWhichMode) {
  // 抓出某頁所需呈現的電影資料
  let dataToShow = getMoviesByPage(moviesArray,page)

  // 生出paginator
  renderPaginator(moviesArray.length)

  // 決定要用哪種方法呈現card or list
  if (renderInWhichMode === 'card') {
    renderMovieListInCard(dataToShow)
  }
  if (renderInWhichMode === 'list') {
    renderMovieListInList(dataToShow)
  }
  
}

// amount:準備render的資料總數目
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

// render genresdropdown button
function renderGenresDropdown () {
  // 將genres從object轉為array
  let genresArray = []
  for(let x in genresObject) {
    genresArray.push(genresObject[x])
  }
  
  genresHtml = `
   <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          選擇分類
        </button>
        <ul class="dropdown-menu">`

  for(let i = 0; i < genresArray.length; i++) {
    genresHtml += `<li id="${i}"><a class="dropdown-item" href="#">${genresArray[i]}</a></li>`
  }

  genresHtml += '</ul>'
  genresDropdownBtn.innerHTML = genresHtml  
}

// 給資料陣列和頁數=>得到該頁的資料陣列
function getMoviesByPage(list,page) {
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return list.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function showMovieModal(id) {
  // get elements
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  
  // 先清空避免換資訊換過慢，導致使用者會看到上一個modal的樣子
  modalTitle.innerText = ''
  modalDate.innerText = ''
  modalImage.innerHTML = ''

  // send request to show api
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results

    // insert data into modal ui
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
  })
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)

  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }

  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

// 依照種類分類
function classify (event) {
  // which genre be choosed
  let genre = Number(event.target.id)
  console.log(genresObject,genre)
  
  // filter movies//我可能又要再加回global variable list 裝 目前所使用的電影array
  
    
}

// listen to data panel
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

//listen to search form
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  renderMovieList(filteredMovies,1,chooseMode())
})

// check which mode
// render之前要確認到底要用card的模式或list的模式
function chooseMode () {
   if(dataPanel.getElementsByTagName('li').length>0) {
     return 'list'
   } else {
     return 'card'
   }
}

// use filteredMovies or movies
function chooseMovies () {
  if (filteredMovies.length === 0) {
    return movies
  } else {
    return filteredMovies
  }
}

// listen to switch icon
showInCardBtn.addEventListener('click',() => {
  renderMovieList(chooseMovies(),onWhichPage,'card')
})
showInListBtn.addEventListener('click',() => {
  renderMovieList(chooseMovies(),onWhichPage,'list')  
})

// listen to paginator
paginator.addEventListener('click',(event) => {
  onWhichPage = event.target.innerText
  renderMovieList(chooseMovies(),onWhichPage,chooseMode())
})

// listen to genresDropdownBtn
genresDropdownBtn.addEventListener('click',(event) => {

})

// send request to index api
axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderMovieList(movies,1,'card')
    renderGenresDropdown ()
  })
  .catch((err) => console.log(err))