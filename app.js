const urlTops = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=`;
const urlSerach = `https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=`;
const imgPath = 'https://image.tmdb.org/t/p/w1280/';
const form = document.getElementById('formulario');
const input = document.getElementById('buscar');
let totalPaginas = 1;
let pagina = 1;
let totalResult;

form.addEventListener('submit', e => {
    e.preventDefault();    
    imprimeHTML(urlSerach+buscar.value+'&page='+pagina);    
});

imprimeHTML(urlTops+pagina);

async function getApi(url) {
    const pedido = await fetch(url);
    const respuesta = await pedido.json();
    console.log(respuesta);
    totalPaginas = respuesta.total_pages;
    totalResult = respuesta.total_results;
    return respuesta.results;
}

async function imprimeHTML(url){ 
    const movies = await getApi(url);
    console.log(movies)
    if (totalResult === 0 || !movies) {
        alertaHTML('No se encontraron resultados');
        return;
    }
    navegaPaginas(url);
    const contenedor = document.getElementById('contenedor');
    contenedor.innerHTML = ''; //limpia html    
    movies.forEach(movie => {        
        const {poster_path, title, vote_average, overview} = movie;
        let colorScore;
        if (vote_average >= 7){
            colorScore = 'top'
        } else if (vote_average >= 5){
            colorScore = 'med'
        } else {
            colorScore = 'low'            
        }

        contenedor.innerHTML += `
            <div class="card">
                <img src="${imgPath+poster_path}" />
                <div class="footer-card">
                    <p>${title}</p><span class="score ${colorScore}">${vote_average}</span>
                </div>                
                <div class="info">
                    <h3>${title} (${vote_average})</h3>
                    <p>${overview}</p>
                </div>
            </div>
        `
    });
}

function navegaPaginas(url) {
    if (document.querySelector('.existe')) document.querySelector('.existe').remove();
    const body = document.querySelector('body');
    const div = document.createElement('div');    
    div.classList.add('page-nav','existe');
    div.innerHTML = `
        <button id="prev"><</button> <button id="next">></button>
    `
    body.appendChild(div);

    const btnPrev = document.getElementById('prev');
    const btnNext = document.getElementById('next');

    if (pagina <= 1) btnPrev.classList.add('oculto');
     else btnPrev.classList.remove('oculto');
    if (pagina >= totalPaginas) btnNext.classList.add('oculto');
     else btnNext.classList.remove('oculto');

    btnPrev.onclick = () => {        
        pagina--;
        let urlLimpia = url.substring(0, url.length - 1);
        console.log(urlLimpia+pagina);
        imprimeHTML(urlLimpia+pagina);
    }

    btnNext.onclick = () => {
        pagina++;
        let urlLimpia = url.substring(0, url.length - 1);
        imprimeHTML(urlLimpia+pagina);
    }
}

function alertaHTML(msg) {
    const contenedor = document.getElementById('contenedor');
    const btnPrev = document.getElementById('prev');
    const btnNext = document.getElementById('next');
    btnPrev.classList.add('oculto');
    btnNext.classList.add('oculto');
    contenedor.innerHTML = `
        <div class="alerta">${msg}<br><br>
        <a href="index.html" id="volver">Volver</a></div>
    `

    


}