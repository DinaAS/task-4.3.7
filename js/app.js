const searchBox = document.querySelector('.search-input-box');
const inputForm = document.querySelector('.input');
const suggBox = document.querySelector('.autocom-list');
const responceBox = document.querySelector('.responce-box');



const debounceFn = debounce(handleInput, 400);

inputForm.addEventListener('input', debounceFn);

async function handleInput(e) {
    const {value} = e.target;
    let emptyArr = [];

    if(value && value !== ' ') {
        return await fetch(`https://api.github.com/search/repositories?q=${value}&per_page=6`)
        .then(
            async (res) => {
                let objData = await res.json();
                let arrData = await objData.items;
                return arrData;
            })
        .then((arrData) => {
            emptyArr = arrData.filter((data) => {
                let name = data.name;
                return name.toLowerCase().startsWith(`${value}`.toLowerCase());
            })

            let createCard = emptyArr.forEach((item) => {
                renderResponse(item);
            })
            
            emptyArr = emptyArr.map((data) => {
                return data = '<li>' + data.name + '</li>';
            })
        
            searchBox.classList.add('active')
                
            return emptyArr;
        })
        .then((res) => {
            showSuggetions(res);
            let allList = suggBox.querySelectorAll('li');
            
            for(let i = 0; i < allList.length; i++) {
                allList[i].setAttribute('onclick', 'select(this)')
            }

        }).then(() => {
            inputForm.addEventListener('input', debounceFn);
        }).catch(err => console.log(err))
    } else {
        searchBox.classList.remove('active');
    }
    
}


function debounce(fn, debounceTime) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);

        }, debounceTime)
    }
}

function select(elem) {
    let selectUserData = elem.textContent;
    inputForm.value = '';
    responceBox.classList.remove('hidden');
    searchBox.classList.remove('active');

    const activeCard = responceBox.querySelector(`.${selectUserData}`)

    activeCard.classList.remove('hidden')

    const cancelBtn = document.querySelectorAll('.cancel-icon');

    Array.from(cancelBtn).forEach((btn) => {
        btn.addEventListener('click', function(e) {
            activeCard.classList.add('hidden');
            inputForm.value = '';
        })
    });

}

function renderResponse(elem) {
    const fragment = document.createDocumentFragment();
    const card = document.createElement('div');
    card.classList.add('card', 'hidden', `${elem.name}`);
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const cardText = document.createElement('div');
    cardText.classList.add('text');
    const nameRep = document.createElement('p');
    nameRep.classList.add('name-rep');
    nameRep.textContent = 'Name: ' + elem.name;
    const owner = document.createElement('p');
    owner.classList.add('owner');
    owner.textContent = 'Owner: ' + elem.owner['login'];
    const stars = document.createElement('p');
    stars.classList.add('stars');
    stars.textContent = 'Stars: ' + elem['stargazers_count'];
    const cancelIcon = document.createElement('div');
    cancelIcon.classList.add('cancel-icon')
    const vec1 = document.createElement('img');
    const vec2 = document.createElement('img');
    vec1.classList.add('vector-1');
    vec2.classList.add('vector-2');
    vec1.src = 'png/Vector 1.png'
    vec2.src = 'png/Vector 3.png'
    cancelIcon.appendChild(vec1);
    cancelIcon.appendChild(vec2);
    cardBody.appendChild(cardText)
    cardText.appendChild(nameRep);
    cardText.appendChild(owner);
    cardText.appendChild(stars);
    cardBody.appendChild(cancelIcon);
    card.appendChild(cardBody);
    fragment.appendChild(card);
    responceBox.appendChild(fragment);
}

function showSuggetions(list) {
    let listData;
    if(!list.length) {
        userValue = inputForm.value;
        listData = '<li>' + userValue + '</li>';
    } else {
        listData = list.join('');
    }

    suggBox.innerHTML = listData;
}