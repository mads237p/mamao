document.addEventListener("DOMContentLoaded", start);

let gallery; //ARRAY - Liste 

let filter = "alle"; //Alle skal vises som udgangspunkt
let detalje = document.querySelector("#detalje");

document.querySelector("#menuknap").addEventListener("click", toggleMenu);

function start() {

    document.querySelector("#arrow").addEventListener("click", () => {

        document.querySelector("nav").scrollIntoView({
            behavior: 'smooth'
        })
    });

    detalje.style.display = "none"; //Fjerne alt styling fra variabel "detalje"

    const filtrer = document.querySelectorAll(".filter"); // laver selector til variabel
    filtrer.forEach(knap => knap.addEventListener("click", filtrerBilleder)); //laver knap som sender videre til filtreringsfunktion.

    hentJson();
}

async function hentJson() {

    const JsonURL = "https://spreadsheets.google.com/feeds/list/1GpINnM4T06f0kmnvTbFIUhjcDDQIBfumXkSyaEKTzEw/od6/public/values?alt=json";

    const response = await fetch(JsonURL);
    console.log(response); // Venter på at hente (fetche) JSON fil.

    gallery = await response.json(); // Vores array venter på svar fra JSON 
    console.log(gallery);

    vis();
}

function filtrerBilleder() {

    //Sæt variable filter til aktuel værdi

    let valgt = document.querySelector(".valgt");

    valgt.classList.remove("valgt"); //fjerner class
    filter = this.dataset.filter; //Det datafilter knappen som er blevet trykket på, får navnet filter.

    this.classList.add("valgt"); //tilføjer class til "denne"(this) knap som er blevet trykket på på

    vis(); //gå til funktionen vis

}

function vis() {

    const temp = document.querySelector("template").content;
    // variabel på indholdet (content) af template
    const dest = document.querySelector("#grid");
    //variabel på vores destination (grid)

    dest.textContent = ""; //fjerne alt indhold i variablen "dest"

    gallery.feed.entry.forEach(billede => {
        // For hvert element i vores array, skal den gøre følgende:

        if (billede.gsx$kategori.$t == filter || billede.gsx$kunstner.$t == filter || filter == "alle") { // Filtrere kategorier og kunstnernavn

            const klon = temp.cloneNode(true); // Variabel på cloneNode, som kloner vores template

            klon.querySelector("img").src = "img_small/" + billede.gsx$billede.$t + ".jpg";
            klon.querySelector(".kategori").textContent = billede.gsx$kategori.$t;
            klon.querySelector("img").alt = "billede af " + billede.gsx$billede.$t; // Klon variabel, kloner element og putter JSON element ind i stedet
            klon.querySelector(".gallery").addEventListener("click", () => {

                visDetalje(billede); // Laver funktion som åbner detalje, hvis du klikker på gallery element
            });

            dest.appendChild(klon); // putter  vores vores klon element ind (appender) i vores "dest" som er vores grid galleri.
        }
    });
}

function visDetalje(billede) {

    // ELEMENTER DER SKAL VISES I DETALJEN

    detalje.style.display = "block";
    document.querySelector("#detalje .kategori").textContent = billede.gsx$kategori.$t;
    document.querySelector("#detalje h2").textContent = billede.gsx$navn.$t;
    document.querySelector("#detalje h2").setAttribute("id", "billede");
    document.querySelector("#detalje img").src = "img_store/" + billede.gsx$billede.$t + ".jpg";
    document.querySelector("#detalje img").alt = "Billede af" + billede.gsx$billede.$t;
    document.querySelector("#detalje .beskrivelse").textContent = billede.gsx$billedebeskrivelse.$t;
    document.querySelector("#detalje #kunstner").textContent = "by " + billede.gsx$kunstner.$t;

    const luk = document.querySelector(".luk");
    luk.addEventListener("click", skjulDisplay);
    console.log("luk");

    document.querySelector("#kunstner").addEventListener("click", () => {

        // location.href = 'artists.html'; // Åbner link
        location.href = `artists.html?kunstner=${billede.gsx$kunstner.$t}`;
    });

}


function skjulDisplay() {

    detalje.style.display = "none";

    //Skjuler display, ved at vise ingenting.
}

function toggleMenu() {
    console.log("toggleMenu");

    document.querySelector(".burgermenu").classList.toggle("hidden"); //har toggler classen "hidden" on/off

    let erSkjult = document.querySelector(".burgermenu").classList.contains("hidden");

    if (erSkjult == true) { //hvis hidden er på knappen

        document.querySelector("#menuknap").textContent = "☰"; //skal denne vises

    } else { //ellers skal krydset vises.

        document.querySelector("#menuknap").textContent = "𝘅";

    }
}
