const BASIC_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASIC_URL + '/api/v1/users'
const usersContainer = document.querySelector('#users-container')
const modal = document.querySelector('#Modal')
const allUsersBtn = document.querySelector('#all-friends')
let users = []


axios.get(INDEX_URL)
  .then(res => {
    users.push(...res.data.results)
    showEachPage(1,users)
  })
  .catch(error => console.log(error)
  )

// render
function render (data) {
  let rawHTML = ''
  data.forEach(element => {    
    rawHTML += `
      <div class="col-sm-6 col-md-4 user-panel" data-bs-toggle="modal" data-bs-target="#Modal" id="${element.id}">
        <div class="rounded-pill border border-primary border-2 p-1 m-2 change">
          <div class="row align-items-center p-2">
            <div class="col-4">
              <img src="${element.avatar}" alt="" class="rounded-circle" width="120%">
            </div>
            
            <div id="data" class="col-8">
              <div class="responsive-font" id="name">${element.name}</div>
            </div>

              </div>
          </div>
      </div>`
  }) 
  usersContainer.innerHTML = rawHTML
  setEventListeners()
}

//change the content in modal
function setEventListeners () {
  let userPanels = document.querySelectorAll('.user-panel')
  userPanels.forEach(userPanel => {
  userPanel.addEventListener('click',showModal)
})
}


function showModal (event) {
  const user = event.currentTarget   
  modal.querySelector('#title').innerHTML = user.innerText
  const id = user.id
  const userData = users.find(element => element.id == id)  
  modal.querySelector('.modal-body').innerHTML = `
    <div class="container">
      <div class="row">
        <div class="col-4 d-flex align-items-center">
          <img src="${userData.avatar}" class="rounded-circle" p-0" >
        </div>

        <div class="col-8">
          <p>age: ${userData.age}</p> 
          <p>gender: ${userData.gender}</p>
          <p>email: ${userData.email}</p>
        </div>
      </div>
    </div>
  `
  modal.querySelector('.modal-footer').innerHTML = `
  <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              加入好友群組
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item type1" href="#" id="${id}">吃喝玩樂好朋友</a></li>
              <li><a class="dropdown-item type2" href="#" id="${id}">公司同仁</a></li>
            </ul>
          </div>
  `
  // 裝event listener在dropdown item 上
  setDropdownItemEventListener ()
}

// search user
const searchButton = document.querySelector("#search-button")
searchButton.addEventListener('click',searchUser)
function searchUser (event) {
  event.preventDefault()
  // 這裡要怎麼命名會比較好呢?
  let searchBarValue = document.querySelector("#search-value").value.trim().toLowerCase()
  
  if (searchBarValue.length === 0) {
    alert('請輸入欲搜尋的好友名稱')
    document.querySelector("#search-value").value = ""
  }

  let searchedList = users.filter(user => user.name.toLowerCase().includes(searchBarValue))
  if (searchedList.length === 0) {
    alert('查無此人')
    document.querySelector("#search-value").value = ""
  } else {        
    showEachPage(1,searchedList)
    document.querySelector("#search-value").value = ""
  }
}

// 聯絡人分類
// 1.在好友群組的鍵上加上event listener
function setDropdownItemEventListener () {
  let dropdownItem1 = document.querySelector(".type1")
  dropdownItem1.addEventListener('click',classifyUsers)
  
  let dropdownItem2 = document.querySelector(".type2")
  dropdownItem2.addEventListener('click',classifyUsers)  
}

// 2.將指定user加入localstorage
function classifyUsers(event) {
  const id = Number(event.target.id)
  const type =  event.target.innerText  
  const user = users.find(user => user.id === id)
   
  const localList= JSON.parse(localStorage.getItem(type)) || []
  if(localList.some(el => el.id === id)){
    alert('此好友已在好友群組中')
    return
  } else {
    localList.push(user)
  }

  localStorage.setItem(type,JSON.stringify(localList))
  alert(`已將${user.name}加入【${type}】群組中`)
  // 如何讓modal自動關閉
}

// 生出頁數
function showPagination(list) {
  
  let pagesHtml = `
    <ul class="pagination d-flex justify-content-center">
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>`
 
  for (let i = 1; i <= Math.ceil(list.length/18); i++){
    pagesHtml += `
     <li class="page-item"><a class="page-link" href="#">${i}</a></li>
    `
  }

  pagesHtml += `
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
      </li>
    </ul>
  `

  document.querySelector('#pagination').innerHTML = pagesHtml
  document.querySelectorAll('.page-item').forEach(item => {
    item.addEventListener('click',(el) => {    
      showEachPage(el.currentTarget.innerText,list)
    })
  })
}

// 讓每頁出現18 users
function showEachPage (page,list) {
  let dataEachPage = list.slice((page - 1)*18,page * 18)
  render(dataEachPage)
  showPagination(list)
  setEventListeners ()
}

// 點擊全部的好友後會顯示全部的好友
allUsersBtn.addEventListener('click',() => {showEachPage(1,users)})




