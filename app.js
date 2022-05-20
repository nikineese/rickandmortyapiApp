const root = document.getElementById('root');
const searchBtn = document.querySelector('#search-btn')
const loadMoreBtn = document.querySelector('.load-more')
searchBtn.addEventListener('click', search)
let charactersArr = []
if (!localStorage.getItem('characters')) {
    localStorage.setItem('characters', JSON.stringify(charactersArr))
} else {
    const characters = JSON.parse(localStorage.getItem('characters'))
    for (let i = 0; i < characters.length; i++) {
        renderChar(JSON.parse(characters[i]))
    }
    charactersArr = characters
}
let hiddenAmount = 5
loadMoreBtn.classList.add('none')

function search() {
    const id = document.querySelector('#search-input').value
    getCharacterById(id)
        .then((data) => {
            if (data) {
                if (charactersArr.includes(JSON.stringify(data))) {
                    alert('Character is already exist')

                } else {
                    charactersArr.push(JSON.stringify(data))
                    localStorage.setItem('characters', JSON.stringify(charactersArr))
                    if (charactersArr.length > 5) {
                        renderChar(data, 'none')
                        loadMoreBtn.addEventListener('click', loadMore)
                        loadMoreBtn.classList.remove('none')

                    } else {
                        renderChar(data)
                    }
                }


            }

        })
}

async function getCharacterById(id) {
    return await fetch(`https://rickandmortyapi.com/api/character/${id}`)
        .then((response) => {
            if (response.ok && response.status === 200) {
                return response.json()
            }
            alert('Character not found')
        })


}

function loadMore() {
    let hiddenCharacters = charactersArr.length - 5
    if (hiddenCharacters > 5) {
        hiddenCharacters = 5
    }
    const characters = document.querySelectorAll('.character')
    for (let i = 0; i < hiddenCharacters; i++) {
        try {
            characters[i + hiddenAmount].classList.remove('none')
        } catch (e) {
            break
        }

    }
    if (hiddenCharacters === 5) {
        hiddenAmount += 5
    }
}

function renderChar(data, display = 'block') {
    const charactersBlock = document.querySelector('#characters-wrap')
    const html = `<div class="character ${display}">
            <img src="${data.image}" alt="avatar" class="character__avatar">
            <div class="character__delete"></div>
            <div class="character__info">
                <p class="character__name">${data.name}</p>
                <p class="character__gender">${data.gender}</p>
                <p class="character__status ${data.status.toLowerCase()}">${data.status}</p>
            </div>

        </div>`
    charactersBlock.insertAdjacentHTML('beforeend', html)
    const deleteBtn = document.querySelectorAll('.character__delete')
    deleteBtn.forEach(btn => {
        btn.addEventListener('click', deleteCharacter)
    })
}

function deleteCharacter(e) {
    if (confirm('Are you sure you want to delete this?')) {
        const btn = e.target
        const name = btn.closest('.character').querySelector('.character__name').textContent
        for (let i = 0; i < charactersArr.length; i++) {
            if (JSON.parse(charactersArr[i]).name === name) {
                charactersArr.splice(i, 1)
            }
        }
        localStorage.setItem('characters', JSON.stringify(charactersArr))
        btn.closest('.character').remove()
    }


}
