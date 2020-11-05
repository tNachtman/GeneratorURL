/* 
    FUNKCJE GENERUJĄCE DANE
*/
let counter = 0;
let company_counter = 0;
let company_start = 1;

const GenerujURL = (firmy) => {
    let company_query = ``;

    for(let i=0; i<firmy.length; i++){
        company_query += `%22${firmy[i]}%22OR`;
        company_counter++;
    }

    // Usuwam tego ostatniego zbędnego OR'a
    company_query = company_query.slice(0, -2);
    
    let url = `https://www.linkedin.com/sales/search/company?doFetchHeroCard=false&keywords=${company_query}&logHistory=false`;
    return url;
}

const GenerujNazwyFirm = (firmy) => {
    return `Numery ${company_start} - ${company_counter}`;
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
        
        // UWAGA: ilość znaków w zapytaniu nie może przekroczyć 1000
        let po_ile_firm = parseInt($('#po_ile_firm').val()); // pobierz ile firm brać pod uwagę w jednym zapytaniu ze strony (domyślnie 45)

        for(let j=0; j<(lines.length - (lines.length%po_ile_firm)); j+=po_ile_firm){
            firmy = []; // zerujemy listę poprzednich firm
            company_start = j+1; // zmieniamy numerację startową na obecną
            for(let i=j; i<j+po_ile_firm; i++){ 

                // Tablica firm przesyłana do funkcji
                firmy.push(lines[i].split('&').join('%26')); // trzeba zastąpić wszystkie '&' kodem URL
            }
            // console.log(firmy); // W razie potrzeby włączyć można
            GenerujDane(firmy); // Generujemy dane i wyświetlamy na stronie
        }

        // Generujemy pozostałe firmy (o ile istnieją)
        if(lines.length%po_ile_firm != 0){
            firmy = [];
            company_start += po_ile_firm;
            
            for(let i=company_start-1; i<lines.length; i++){
                firmy.push(lines[i].split('&').join('%26'));
            }
            GenerujDane(firmy);
        }
    };

    reader.onerror = (e) => alert(e.target.error.name);

    reader.readAsText(file);
});

const Generator = () => {
    counter = 0;
    company_counter = 0;
    company_start = 1;
    files = input[0].files;
    $('#data-body').html("");

    if(files.length == 0) return;

    const file = files[0];

    let reader = new FileReader();

    reader.onload = (e) => {
        const file = e.target.result;
        const lines = file.split(/\r\n|\n/); // Podziel wszystkie linijki na osobne wartości array'a

        let firmy = [];
        
        // UWAGA: ilość znaków w zapytaniu nie może przekroczyć 1000
        let po_ile_firm = parseInt($('#po_ile_firm').val()); // pobierz ile firm brać pod uwagę w jednym zapytaniu ze strony (domyślnie 45)

        for(let j=0; j<(lines.length - (lines.length%po_ile_firm)); j+=po_ile_firm){
            firmy = []; // zerujemy listę poprzednich firm
            company_start = j+1; // zmieniamy numerację startową na obecną
            for(let i=j; i<j+po_ile_firm; i++){ 

                // Tablica firm przesyłana do funkcji
                firmy.push(lines[i].split('&').join('%26')); // trzeba zastąpić wszystkie '&' kodem URL
            }

            GenerujDane(firmy); // Generujemy dane i wyświetlamy na stronie
        }

        // Generujemy pozostałe firmy (o ile istnieją)
        if(lines.length%po_ile_firm != 0){
            firmy = [];
            company_start += po_ile_firm;
            
            for(let i=company_start-1; i<lines.length; i++){
                firmy.push(lines[i].split('&').join('%26'));
            }
            GenerujDane(firmy);
        }
    };

    reader.onerror = (e) => alert(e.target.error.name);

    reader.readAsText(file);
}

$('#licz').on('click', Generator);