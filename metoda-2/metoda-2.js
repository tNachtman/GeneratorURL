/* 
    FUNKCJE GENERUJĄCE DANE
*/
let counter = 0;
let company_counter = 0;

const GenerujURL = (firmy) => {
    let company_query = ``;

    for(let i=0; i<firmy.length; i++){
        company_query += `%22${firmy[i]}%22OR`;
        company_counter++;
        console.log(company_counter);
    }

    // Usuwam tego ostatniego zbędnego OR'a
    company_query = company_query.slice(0, -2);
    
    let url = `https://www.linkedin.com/sales/search/company?doFetchHeroCard=false&keywords=${company_query}&logHistory=false`;
    return url;
}

const GenerujNazwyFirm = (firmy) => {
    return `Numery 1 - ${company_counter}`;
}

const GenerujDane = (firmy) => {
    let adres_linku = GenerujURL(firmy);
    let nazwy_firm = GenerujNazwyFirm(firmy);
    counter++;
    $('#data-body').append(`<tr><th scope="row">${counter}</th><td><a href="${adres_linku}" target="_blank">Kopiuj link</a></td><td>${nazwy_firm}</td></tr>`);
}


/* 
    KOD OBSŁUGUJĄCY PLIKI TEKSTOWE
*/

let input = $('#input');

input.on('change', () => {
    let files = input[0].files;

    if(files.length == 0) return;

    const file = files[0];

    let reader = new FileReader();

    reader.onload = (e) => {
        const file = e.target.result;
        const lines = file.split(/\r\n|\n/); // Podziel wszystkie linijki na osobne wartości array'a

        let firmy = [];
        
        // póki co do testowania używamy 45 pierwszych firm (nie powinno przekroczyć tego 1000 znaków)
        for(let i=0; i<45; i++){ 

            // Tablica firm przesyłana do funkcji
            firmy.push(lines[i].split('&').join('%26')); // trzeba zastąpić wszystkie '&' kodem URL
        }

        GenerujDane(firmy);
    };

    reader.onerror = (e) => alert(e.target.error.name);

    reader.readAsText(file);
});