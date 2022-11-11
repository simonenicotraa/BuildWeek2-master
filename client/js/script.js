// registrazione
function registrati() {

    let obj = {
        name: document.querySelector('form input:first-of-type').value,
        username: document.querySelector('form  input:nth-child(2)').value,
        email: document.querySelector('form  input:nth-child(3)').value,
        address: {
            street: document.querySelector('form input:nth-child(4)').value,
            suite: document.querySelector('form input:nth-child(5)').value,
            city: document.querySelector('form input:nth-child(6)').value,
            zipcode: document.querySelector('form input:nth-child(7)').value,
        },
        phone: document.querySelector('form input:nth-child(8)').value,
        website: document.querySelector('form input:nth-child(9)').value,

    }
    fetch('http://localhost:3000/api/users/', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((json) => console.log(json));

}

// LOGIN
function login() {
    fetch('http://localhost:3000/api/users/login/', {
        method: "POST",
        headers: {
            "Accept": "application/json,",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: document.querySelector('input[name="username"]').value,
            email: document.querySelector('input[name="email"]').value
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

            if (data == 'errore') {
                alert("Errore Username o Password");
            } else {
                let j = JSON.stringify(data);
                localStorage.setItem('users', j);
                window.open(
                    "homepage.html", "_self" /* per aprire nella stessa finestra senza aprirne altre */
                );
            }
        })
}







// homepage
document.addEventListener('DOMContentLoaded', function () {
    stampaPost()
    profilo();
    stampaUtenti();
})

function profilo() {
    let profilo = document.querySelector('.sinistra .profilo');
    let users = localStorage.getItem('users');
    let francesca = JSON.parse(users);
    profilo.innerHTML = `<div class="immagine">
                                     <img src="images/placeholder.png" alt="">
                                     </div>
                                     <div class="info">
                                     <p> ${francesca.name}</p>
                                     <a href="mailto:${francesca.email}">${francesca.email}</a>
                                     </div>
                                    `
    let infoPer = document.querySelector('.sinistra .info-personali');
    infoPer.innerHTML = `
                            <p>My City: ${francesca.address.city}, ${francesca.address.street}, ${francesca.address.zipcode}
                            <p><a href= ${francesca.website}">My website: ${francesca.website}</a></p>
                            <p><a href="tel:${francesca.phone}">My number: ${francesca.phone}</a></p>
                            <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">Modifica</button>
                        `
}
function modificaDati() {
    let iden = localStorage.getItem('users')
    let id = JSON.parse(iden)
    console.log(id)
    fetch('https://localhost:3000/api/users/' + id.id, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: id.id,
            nome: document.querySelector('.modal-body form input:nth-child(1)').value,
            username: document.querySelector('.modal-body form input:nth-child(2)').value,
            email: document.querySelector('.modal-body form input:nth-child(3)').value,
            address: {
                street: document.querySelector('.modal-body form input:nth-child(4)').value,
                suite: document.querySelector('.modal-body form input:nth-child(5)').value,
                city: document.querySelector('.modal-body form input:nth-child(6)').value,
                zipcode: document.querySelector('.modal-body form input:nth-child(7)').value,
            },
            phone: document.querySelector('.modal-body form input:nth-child(8)').value,
            website: document.querySelector('.modal-body form input:nth-child(9)').value,
        })
    }).then(response => response.json()).then(json => console.log(json))
}

function stampaPost() {
    let sezPost = document.querySelector('.allPost');
    sezPost.innerHTML = '';
    fetch('http://localhost:3000/api/post')
        .then((response) => response.json())
        .then((json) =>

            json.reverse().forEach(ele => {
                let div = document.createElement('div')
                div.innerHTML = `<img src="https://picsum.photos/200/300?random=1%22%3E">
                                <h3>${ele.title}</h3>
                                <p>${ele.body}</p>
                                <button onclick="vediCommenti(${ele.id})">Vedi i commenti</button>`;
                sezPost.appendChild(div)
                let commenti = document.createElement('div')
                commenti.className = 'commenti' + ele.id;
                div.appendChild(commenti)
            }));
}

function stampaUtenti() {
    let allUser = document.querySelector('.destra .contacts');
    fetch('http://localhost:3000/api/users')
        .then((response) => response.json())
        .then((json) =>
            json.forEach(ele => {
                let div = document.createElement('div')
                div.className = 'info-card'
                let divInfo = document.createElement('div')
                divInfo.className = 'informazioni'
                divInfo.innerHTML = `<img src="images/placeholder.png" alt="profile pic">
                                     <span> ${ele.name}</span> `

                let button = document.createElement('button')
                button.className = 'more'
                button.innerText = 'Info'
                button.innerHTML = `<i class="bi bi-arrow-down-short"></i>`
                button.addEventListener('click', function () {
                    div.classList.toggle('card-height')
                })

                let divCard = document.createElement('div')
                divCard.className = 'more-info'
                divCard.innerHTML = `<p>City: ${ele.address.city}, ${ele.address.street}, ${ele.address.zipcode}</p>
                                    <p> <a href="${ele.website}">Website: ${ele.website}</a> </p>
                                    <p> <a href="tel:${ele.phone}">Phone: ${ele.phone}</a>  </p>`


                allUser.appendChild(div)
                div.appendChild(divInfo)
                divInfo.appendChild(button)
                div.appendChild(divCard)
            }))


}



function logout() {
    localStorage.clear();
    window.open(
        "index.html", "_self" /* per aprire nella stessa finestra senza aprirne altre */
    )
}
function info(id) {
    let allUser = document.querySelector('.infoUtente' + id);
    let divinfo = document.createElement('span');

    divinfo.className = 'pienoVuoto' + id;
    let pienoVuoto = document.querySelectorAll('.pienoVuoto' + id)
    if (pienoVuoto.length == 1) {
        let x = document.querySelector('.pienoVuoto' + id)
        x.remove()
    } else if (pienoVuoto.length == 0) {
        allUser.appendChild(divinfo);
        fetch('http://localhost:3000/api/users/' + id)
            .then(res => res.json())
            .then(json => {
                divinfo.innerHTML = `
                 <p>${json.address.city}, ${json.address.street}, ${json.address.zipcode}</p>
                <a href="${json.website}">${json.website}</a>
                <a href="tel:${json.phone}">${json.phone}</a>`
            })
    }
}





function aggiungiPost() {
    let log = localStorage.getItem('users');
    let loggato = JSON.parse(log)
    let post = {
        userId: loggato.id,
        title: document.querySelector('input[name="tito"]').value,
        body: document.querySelector('input[name="contpost"]').value
    }

    fetch('http://localhost:3000/api/post/', {
        method: 'POST',
        body: JSON.stringify(post),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((json) => console.log(json));
    stampaPost();
}

function vediCommenti(id) {
    let allUser = document.querySelector('.commenti' + id);
    let divinfo = document.createElement('span');
    divinfo.className = 'pienoVuoto' + id;
    let pienoVuoto = document.querySelectorAll('.pienoVuoto' + id);

    if (pienoVuoto.length >= 1) {
        let x = document.querySelector('.pienoVuoto' + id);
        x.remove();
    } else if (pienoVuoto.length == 0) {
        allUser.appendChild(divinfo);
        fetch('http://localhost:3000/api/commenti/' + id)
            .then(res => res.json())
            .then(json => {
                json.forEach(ele => {
                    /*  let titolo = document.createElement('p'); */
                    let commento = document.createElement('p');
                    /* titolo.innerText = ele.name; */
                    /*   titolo.className = 'titolo'; */
                    commento.innerHTML = `<i class="bi bi-chat-quote"></i>
                                         <span>${ele.body}</span>`
                    commento.className = 'commento';

                    /* divinfo.appendChild(titolo); */
                    divinfo.appendChild(commento);
                })
            })
    }
}

/* window.onscroll = function () { scrolling() };


function scrolling() {

    let y = document.documentElement.scrollTop

    console.log(y)
    if (y > 600) {
        console.log('ciao')
        let div = document.querySelector('.centro')
        div.style.height += (y + 200).toString() + 'px'
        if (y >= 600) {
            y = 0;
        }
    }

};
 */









function myFunction() {
    let input, filter, contatti, a, txtValue;
    input = document.querySelector('#filtro')
    filter = input.value.toUpperCase();
    contatti = document.querySelector('.contacts')
    utent = contatti.querySelectorAll('.info-card');
    for (i = 0; i < utent.length; i++) {
        a = utent[i].getElementsByTagName("span")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            utent[i].style.display = "";
        } else {
            utent[i].style.display = "none";
        }
    }

}
