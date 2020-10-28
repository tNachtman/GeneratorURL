// Mechanizm generujący dane
let counter = 0;

const GenerujURL = (firma1, firma2, firma3, firma4, firma5, firma6) => {
    let url = `https://linkedin.com/search/results/people/?company=(${firma1})OR(${firma2})OR(${firma3})OR(${firma4})OR(${firma5})OR(${firma6})&origin=FACETED_SEARCH`;
    return url;
}

const GenerujNazwyFirm = (firma1, firma2, firma3, firma4, firma5, firma6) => {
    return `${firma1}, ${firma2}, ${firma3}, ${firma4}, ${firma5}, ${firma6}`;
}

const GenerujDane = (firma1, firma2, firma3, firma4, firma5, firma6) => {
    let adres_linku = GenerujURL(firma1, firma2, firma3, firma4, firma5, firma6);
    let firmy = GenerujNazwyFirm(firma1, firma2, firma3, firma4, firma5, firma6);
    counter++;
    $('#data-body').append(`<tr><th scope="row">${counter}</th><td><a href="${adres_linku}" target="_blank">Kopiuj link</a></td><td>${firmy}</td></tr>`);
}

// GenerujDane("24 Tax and Consulting ltd", "Aldi UK", "Allegis Group", "Altrad Services", "Altrad Services UK", "Amaris Hospitality");
// GenerujDane("24 Tax and Consulting ltd", "Aldi UK", "Allegis Group", "Altrad Services", "Altrad Services UK", "Amaris Hospitality");


// KOD CZYTAJĄCY PLIKI TEKSTOWE

let input = $('#input');

input.on('change', () => {
    let files = input[0].files;
    // console.log(input[0].files); // Debugowanie

    if(files.length == 0) return;

    const file = files[0];

    let reader = new FileReader();

    reader.onload = (e) => {
        const file = e.target.result;
        const lines = file.split(/\r\n|\n/); //Podziel wszystkie linijki na osobne wartości array'a

        //Wykonuje się biorąc po 6 firm
        for(let i=0; i<(lines.length - (lines.length%6)); i+=6){
            counter++;
            GenerujDane(lines[i], lines[i+1], lines[i+2], lines[i+3], lines[i+4], lines[i+5]);
        }

        //Wykonuje się dla firm, które pozostały - jeśli istnieją
        if(lines.length%6 != 0){
            counter++;
            let firmy = "";
            let nazwy_firm = "";
            // let url = `linkedin.com/search/results/people/?company="${firma1}"OR"${firma2}"OR"${firma3}"OR"${firma4}"OR"${firma5}"OR"${firma6}"&origin=FACETED_SEARCH`;
            for(let i=1; i<=(lines.length%6); i++){
                firmy += `(${lines[lines.length-i]})OR`;
                nazwy_firm += `${lines[lines.length-i]}, `;
            }

            nazwy_firm = nazwy_firm.slice(0, -1);
            firmy = firmy.slice(0, -2);
            let url = `https://linkedin.com/search/results/people/?company=${firmy}&origin=FACETED_SEARCH`;

            $('#data-body').append(`<tr><th scope="row">${counter}</th><td><a href="${url}" target="_blank">Kopiuj link</a></td><td>${nazwy_firm}</td></tr>`);
        }
    };

    reader.onerror = (e) => alert(e.target.error.name);

    reader.readAsText(file);
});