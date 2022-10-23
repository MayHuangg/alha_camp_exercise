const BASIC_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASIC_URL + '/api/v1/users'

const usersContainer = document.querySelector('#users-container')
const modal = document.querySelector('#Modal')

const groupName = document.querySelector('#group-name')
let users = []
let friends = []

axios.get(INDEX_URL)
  .then(res => {
    users.push(...res.data.results)
    friends = JSON.parse(localStorage.getItem(groupName.innerText))
    showEachPage(1,friends)
    makePages(friends)    
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
  setEventListeners ()
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
  console.log(user)
    
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
      <button type="button" class="btn btn-primary remove-btn" id="${userData.id}">自群組中移除
      </button>
  `
  setRemoveBtnEventListener()
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

  let searchedList = friends.filter(user => user.name.toLowerCase().includes(searchBarValue))
  if (searchedList.length === 0) {
    alert('查無此人')
    document.querySelector("#search-value").value = ""
  } else {
    showEachPage(1,searchedList)
    setEventListeners ()
    makePages(searchedList)   
    document.querySelector("#search-value").value = ""
  }
}

// remove form group
function setRemoveBtnEventListener() {
  let removeBtn = document.querySelector('.remove-btn')
  removeBtn.addEventListener('click',removeFromGroup)
}
function removeFromGroup (event) {
  const id = Number(event.target.id)
  const type =  groupName.innerText 
  const usersInGroup = JSON.parse(localStorage.getItem(type))
  const index = usersInGroup.findIndex(el => el.id === id)

  usersInGroup.splice(index,1)
  localStorage.setItem(type,JSON.stringify(usersInGroup))
  alert(`已將此人自【${type}】群組移除`)

  showEachPage(1,usersInGroup)
  makePages(usersInGroup)
  // 如何讓modal自動關閉
}

// 生出頁數
function makePages(list) {
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
}