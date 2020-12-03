
const default_url = "https://www.linkedin.com/sales/search/people?doFetchHeroCard=false&geoIncluded=105072130";

const getData = () => {
    /**
     * Pobierz dane HTMLa
     * Pobiera konkretne wartości wpisane przez użytkownika
     */
    const firstname_col = $('#firstname_col').val();
    const lastname_col = $('#lastname_col').val();
    const company_col = $('#company_col').val();
}

/* 
    FUNKCJE GENERUJĄCE DANE
*/
let counter = 0;

const GenerujURL = (firmy) => {
    const company_checkbox = $('#checkbox_company').prop('checked');
    const keywords_checkbox = $('#checkbox_keywords').prop('checked');
    
    let url = `${$('#search_link').val()}`;

    if(keywords_checkbox){
        let company_query = firmy.join('%22OR%22');
        company_query = company_query.split(' ').join('%20');
        
        url += `&keywords=%22${company_query}%22`;
    }
    // if(company_checkbox){
    //     let company_query = firmy.join('%2C');
    //     company_query = company_query.split(' ').join('%20');

    //     url += `&companyIncluded=${company_query}&companyTimeScope=CURRENT`;
    // }
    if(company_checkbox){
        let company_query = firmy.join('%2522OR%2522');
        company_query = company_query.split(' ').join('%20');

        url += `&companyIncluded=%2522${company_query}%2522&companyTimeScope=CURRENT`;
    }

    return url;
}

const GenerujNazwyFirm = (firmy) => {
    return `Numery ${company_start} - ${company_counter}`;
}

const GenerujDane = (url, simple_url, dane) => {
    counter++;
    $('#data-body').append(`<tr><th scope="row">${counter}</th><td><a class="btn btn-primary" href="${url}" target="_blank">SalesNav</a></td><td><a class="btn btn-warning" href="${simple_url}" target="_blank">Simple</a></td><td>${dane}</td></tr>`);
    $('#wyniki_textarea').val($('#wyniki_textarea').val()+url+'\r\n');
}


/* 
    KOD OBSŁUGUJĄCY PLIKI TEKSTOWE
*/

let input = $('#input');

// Generowanie z pliku
const GenerujZPliku = () => {
    let firstname_col = $('#firstname_col').val();
    let lastname_col = $('#lastname_col').val();
    let company_col = $('#company_col').val();
    let link = $('#search_link').val();
    let first_row_names = $('#firstrow').prop('checked') ? 1 : 0;

    if(link === "" || link === undefined || link.replace(/\s+/g, '') === ""){
        link = $('#search_link').val(default_url);
    }else{
        files = input[0].files;
        $('#data-body').html("");
    
        if(files.length == 0) return;
    
        const file = files[0];
    
        let reader = new FileReader();
    
        reader.onload = (e) => {
            const file = e.target.result;
            const lines = file.split(/\r\n|\n/); // Podziel wszystkie linijki na osobne wartości array'a

            let line = []; //Podziel na linijki
            let firstnames = [];
            let lastnames = [];
            let companies = [];
            for(let i=first_row_names; i<lines.length; i++){
                line = lines[i].split(';');
                firstnames.push(line[firstname_col]); // [tu_nr_kolumny]
                lastnames.push(line[lastname_col]);
                companies.push(line[company_col]);

                let url = `${link}&firstName=${line[firstname_col]}&geoIncluded=105072130&lastName=${line[lastname_col]}&companyIncluded=%2522${line[company_col]}%2522`;
                let simple_url = `https://www.linkedin.com/search/results/people/?company=${line[company_col]}&firstName=${line[firstname_col]}&lastName=${line[lastname_col]}&origin=FACETED_SEARCH`
                let dane = `${line[firstname_col]} ${line[lastname_col]} | ${line[company_col]}`;
                GenerujDane(url, simple_url, dane);
            }

            console.log(firstnames);
            console.log(lastnames);
            console.log(companies);

            
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