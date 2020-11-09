// Zbieranie danych z HTMLa
const region = [];
const stanowisko = [];
let co_szukamy = "osoby";

const getData = () => {
    region.length = 0;
    stanowisko.length = 0;

    co_szukamy = $('input:checked').val();
    console.log("Tryb wyszukiwania: " + co_szukamy.toUpperCase());

    const obj_region = $('#region');
    for(let i=0; i<obj_region.find('.tag').length; i++){
        region.push(obj_region.find('.tag')[i].textContent);
    }

    const obj_stanowisko = $('#stanowisko');
    for(let i=0; i<obj_stanowisko.find('.tag').length; i++){
        stanowisko.push(obj_stanowisko.find('.tag')[i].textContent);
    }
    console.log(region);
    console.log(stanowisko);
}

/* 
    FUNKCJE GENERUJĄCE DANE
*/
let counter = 0;
let company_counter = 0;
let company_start = 1;

const GenerujURL = (firmy) => {
    let company_query = firmy.join('%22OR%22'); // Zastosowana funkcja implodująca (nie pomyślałem o tym wcześniej w sumie)

    company_query = company_query.split(' ').join('%20');
    company_query = "%22" + company_query;

    // przydałaby się możliwość konfiguracji w formularzu bazowego URLa tak aby można było wcześniej prekonfigurować wyszukiwanie np. dodając Państwa.
    // Co do tego to trzeba by było zrobić listę państw, bo w adresie państwo przedstawione jest w ten sposób: &geoIncluded=105072130
    // A łączone są (,) w reprezentacji URL (%2C)
    const panstwa = {
        polska: "105072130",
        anglia: "102299470"
    }
    let url = `https://www.linkedin.com/sales/search/company?doFetchHeroCard=false&keywords=${company_query}&logHistory=false`;
    console.log(url);
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

// Generowanie z pliku
const GenerujZPliku = () => {
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
            company_counter = j+po_ile_firm;// zmieniamy numerację końcową na ostatnią
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
                company_counter = i+1;
            }
            GenerujDane(firmy);
        }
    };

    reader.onerror = (e) => alert(e.target.error.name);

    reader.readAsText(file);
}

$('#licz').on('click', GenerujZPliku);
$('#generuj').on('click', getData);