// Zbieranie danych z HTMLa
const region = [];
const stanowisko = [];
const keywords = [];
let co_szukamy = "osoby";
let metoda = "sales";

const getData = () => {
    /**
     * Pobierz dane HTMLa
     * Pobiera konkretne wartości wpisane przez użytkownika
     */
    region.length = 0;
    stanowisko.length = 0;
    keywords.length = 0;

    co_szukamy = $('input:checked').val();

    const obj_region = $('#region');
    for(let i=0; i<obj_region.find('.tag').length; i++){
        region.push(obj_region.find('.tag')[i].textContent);
    }

    const obj_stanowisko = $('#stanowisko');
    for(let i=0; i<obj_stanowisko.find('.tag').length; i++){
        stanowisko.push(obj_stanowisko.find('.tag')[i].textContent);
    }

    const obj_keywords = $('#keywords');
    for(let i=0; i<obj_keywords.find('.tag').length; i++){
        keywords.push(obj_keywords.find('.tag')[i].textContent);
    }
    console.log(`\n------- Dane ------`);
    console.log(`Tryb wyszukiwania: ${co_szukamy.toUpperCase()}`);
    console.log(`Metoda wyszukiwania: ${metoda}`);
    console.log(keywords);
    console.log(stanowisko);
    console.log(region);
    console.log(`------- #### ------`);
}

const methodSales = () => {
    $('#btn_sales').addClass('btn-primary');
    $('#btn_sales').removeClass('btn-outline-primary');
    $('#btn_simple').removeClass('btn-warning');
    $('#btn_simple').addClass('btn-outline-warning');
    metoda = "sales";
    console.log(`Zmieniona metoda wyszukiwania: ${metoda}`);
}

const methodSimple = () => {
    $('#btn_sales').removeClass('btn-primary');
    $('#btn_sales').addClass('btn-outline-primary');
    $('#btn_simple').addClass('btn-warning');
    $('#btn_simple').removeClass('btn-outline-warning');
    metoda = "simple";
    console.log(`Zmienona metoda wyszukiwania: ${metoda}`);
}

$('#btn_sales').on('click', methodSales);
$('#btn_simple').on('click', methodSimple);

/* 
    FUNKCJE GENERUJĄCE DANE
*/
let counter = 0;
let company_counter = 0;
let company_start = 1;

const GenerujURL = (firmy) => {
    let company_query = firmy.join('%22OR%22');

    company_query = company_query.split(' ').join('%20');
    // let url = `${$('#search_link').val()}&companyIncluded=${company_query}&companyTimeScope=CURRENT`;
    // console.log(url);
    let url = `${$('#search_link').val()}&keywords=%22${company_query}%22`;
    return url;
}

const GenerujNazwyFirm = (firmy) => {
    return `Numery ${company_start} - ${company_counter}`;
}

const GenerujDane = (firmy) => {
    let adres_linku = GenerujURL(firmy);
    let nazwy_firm = GenerujNazwyFirm(firmy);
    counter++;
    $('#data-body').append(`<tr><th scope="row">${counter}</th><td><a class="btn btn-success" href="${adres_linku}" target="_blank">${counter}</a></td><td>${nazwy_firm}</td></tr>`);
}


/* 
    KOD OBSŁUGUJĄCY PLIKI TEKSTOWE
*/

let input = $('#input');

// Generowanie z pliku
const GenerujZPliku = () => {
    const link = $('#search_link').val();
    if(link === "" || link === undefined || link.replace(/\s+/g, '') === ""){
        console.log("Nie ma podanego linku wyszukiwania!");
    }else{
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
    
            let wszystkie_firmy = [];

            // Skopiuj nazwy firm do tablicy "wszystkie_firmy", przy okazji zastąp wszystkie '&' -> '%26'
            // Jednocześnie trzeba zastąpić wszystkie przecinki czymś innym (użyłem tutaj spacji, która później i tak zostanie przekształcona)
            for(let i=0; i<lines.length; i++){
                wszystkie_firmy.push(lines[i].split('&').join('%26').split(',').join(' '));
            }

            let company_string = "";
            let converted_company_string = "";
            let aktualne_firmy = [];
            for(let i=0; i<wszystkie_firmy.length; i++){
                company_counter = i+1;
                company_string += wszystkie_firmy[i];
                converted_company_string = company_string.split(' ').join('%20'); // zamień spacje na %20
                
                // Dodaj 8 do długości stringa bo pomiędzy nazwami znajdzie się jeszcze %22OR%22
                if((converted_company_string.length + 8) >= 1000){
                    console.log(`${converted_company_string.length + 8} to więcej niż 1000!`);

                    // OK, przekroczone 1000 znaków więc wygeneruj link a następnie kontynuuj kolejne firmy
                    GenerujDane(aktualne_firmy);

                    // Przed wystartowaniem dalej wyzeruj listę firm
                    aktualne_firmy.length = 0;
                    company_string = "";
                    converted_company_string = "";

                    // Zmień numer startowy dla kolejnej grupy firm
                    company_start = i;

                    // Kontynuuj generowanie firm
                }else{
                    aktualne_firmy.push(wszystkie_firmy[i].split(' ').join('%20'));
                }
            }
            console.log(aktualne_firmy);

            // Teraz generujemy url
            GenerujDane(aktualne_firmy);
        };
    
        reader.onerror = (e) => alert(e.target.error.name);
    
        reader.readAsText(file);
    }
}

const GenerujZLinku = () => {
    console.log("Jeszcze nie ma tej funkcji");
}

$('#licz').on('click', GenerujZPliku);
$('#generuj').on('click', getData);
$('#link_gen_button').on('click', GenerujZLinku);