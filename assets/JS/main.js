const container = document.querySelector(".container");
const urlBaralho = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';
const criarBaralhoBtn = document.querySelector('#iniciarJogo');
const puxarCartasBtn = document.querySelector('#puxarCartas');
const h1IdBaralho = document.querySelector('#idBaralho');
const lblIdBaralho = document.querySelector('#lblIdBaralho');
const deckCartas = document.querySelector("#deckCartas");
const btnJogarNovamente = document.querySelector("#jogarNovamente");
const divCartaCorreta = document.querySelector('#cartaCorreta');
const divPrincipal = document.querySelector('#divPrincipal');
let cartaCorreta = null;
let chances = 5;


async function criarDeck (url) {
    try {
        const response = await fetch (url)
        const baralho = await response.json();
        console.log(baralho);
        const idDeck = baralho.deck_id;
        await funcPuxarCartas(idDeck, 10);
        lblIdBaralho.innerHTML = `${idDeck}`;
    } catch (err) {
        console.log (`Erro ao criar baralho: ${err}`);
    }
}



criarBaralhoBtn.addEventListener('click', () => {
    console.log('Cliquei aqui');
    criarDeck(urlBaralho); 
    criarBaralhoBtn.classList.add('hidden');
    divPrincipal.classList.remove('hidden');
    h1IdBaralho.classList.remove('hidden');

});

funcPuxarCartas = async function (idBaralho, numCartas) {
    const url = `https://deckofcardsapi.com/api/deck/${idBaralho}/draw/?count=${numCartas}`;
    const response = await fetch(url);
    const cartas = await response.json();
    const cartasJogo = cartas.cards;
    const cartaEscolhidaIndex = Math.floor(Math.random() * cartasJogo.length);
    cartaCorreta = cartasJogo[cartaEscolhidaIndex];
    console.log(cartaCorreta);
    exibirCartas(cartas.cards);
    const imgCartaCorreta = document.createElement('img');
    imgCartaCorreta.src = cartaCorreta.image;
    imgCartaCorreta.dataset.code = cartaCorreta.code;
    divCartaCorreta.appendChild(imgCartaCorreta);
    console.log(imgCartaCorreta);
}

// *URL DA PARTE DE TRÁS DAS CARTAS : https://deckofcardsapi.com/static/img/back.png

function exibirCartas (cartas) {
   let deck = cartas.map(carta => {
        const img = document.createElement('img');
        img.src = 'https://deckofcardsapi.com/static/img/back.png'
        // img.src = carta.image;
        img.style.margin = '10px';
        img.style.height = '150px';
        img.dataset.value = carta.value;
        img.dataset.suit = carta.suit;
        img.dataset.code = carta.code;
        img.dataset.image = carta.image
        console.log(carta);
        deckCartas.appendChild(img);
    });
}

// puxarCartasBtn.addEventListener('click', (e) => {
//     console.log('Puxando nova carta');
//     funcPuxarCartas(lblIdBaralho.innerHTML, 1);
// });

deckCartas.addEventListener('click', async (e) => {
    const carta = e.target.closest('img');
    if (!carta || chances <= 0) return;         // * PARA NÃO QUEBRAR QUANDO CLICAR NA DIV MAS FORA DA CARTA
    console.log(carta);
    if(carta) {
        console.log(`CLIQUEI NA CARTA ${carta.dataset.value} ${carta.dataset.suit} ${carta.dataset.code}`);
        carta.src = carta.dataset.image;
    }
    if(carta.dataset.code === cartaCorreta.code) {
        alert("Você acertou a carta sorteada!");
        chances = 0;
        virarCartas();
        btnJogarNovamente.classList.toggle('hidden');
    }   else {
        chances--;
        if (chances > 0) {
            alert(`Você errou! Você ainda tem ${chances} chances!`);
        }
        else {
            alert ("Suas chances acabaram. tente novamente!");
            virarCartas();
            btnJogarNovamente.classList.toggle('hidden');
        }
    }
});

btnJogarNovamente.addEventListener('click', () => {
    const idAtual = lblIdBaralho.innerHTML;
    chances = 5;
    btnJogarNovamente.classList.toggle('hidden');
    deckCartas.innerHTML = '';
    divCartaCorreta.innerHTML = '';
    funcPuxarCartas(idAtual, 10);
});

function virarCartas () {
    const cartas = deckCartas.querySelectorAll('img');
    cartas.forEach(carta => {
        carta.src = carta.dataset.image;
    });
}

