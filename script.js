document.addEventListener("DOMContentLoaded", start);

const urlParams = new URLSearchParams(window.location.search);
const unik = urlParams.get("id");


let gallery; //ARRAY - Liste

let filter = "alle";
let detalje = document.querySelector("#detalje");

document.querySelector("#menuknap").addEventListener("click", toggleMenu);

function start() {

    detalje.style.display = "none";

    const filtrer = document.querySelectorAll(".filter");
    filtrer.forEach(knap => knap.addEventListener("click", filtrerBilleder));

    hentJson();
}


async function hentJson() {

    const JsonURL = "https://spreadsheets.google.com/feeds/list/1GpINnM4T06f0kmnvTbFIUhjcDDQIBfumXkSyaEKTzEw/od6/public/values?alt=json";

    const response = await fetch(JsonURL);
    console.log(response);

    gallery = await response.json();
    console.log(gallery);

    vis();

}

function filtrerBilleder() {

    //Sæt variable filter til aktuel værdi

    let valgt = document.querySelector(".valgt");

    valgt.classList.remove("valgt");

    filter = this.dataset.filter;

    this.classList.add("valgt");

    vis();

}

function vis() {

    const temp = document.querySelector("template").content;
    const dest = document.querySelector("#grid");

    dest.textContent = "";

    gallery.feed.entry.forEach(billede => {


        if (billede.gsx$kategori.$t == filter || billede.gsx$kunstner.$t == filter || filter == "alle") {

            const klon = temp.cloneNode(true);

            klon.querySelector("img").src = "img_small/" + billede.gsx$billede.$t + ".jpg";
            klon.querySelector(".kategori").textContent = billede.gsx$kategori.$t;
            klon.querySelector("img").alt = "billede af " + billede.gsx$billede.$t;
            klon.querySelector(".gallery").addEventListener("click", () => {

                visDetalje(billede);
            });

            dest.appendChild(klon);
        }
    });
}

function visDetalje(billede) {

    detalje.style.display = "block";
    document.querySelector("#detalje .kategori").textContent = billede.gsx$kategori.$t;
    document.querySelector("#detalje h2").textContent = billede.gsx$navn.$t;
    document.querySelector("#detalje h2").setAttribute("id", "billede");
    document.querySelector("#detalje img").src = "img_small/" + billede.gsx$billede.$t + ".jpg";
    document.querySelector("#detalje img").alt = "Billede af" + billede.gsx$billede.$t;
    document.querySelector("#detalje .beskrivelse").textContent = billede.gsx$billedebeskrivelse.$t;
    document.querySelector("#detalje #kunstner").textContent = "by " + billede.gsx$kunstner.$t;

    const luk = document.querySelector(".luk");
    luk.addEventListener("click", skjulDisplay);
    console.log("luk");

    document.querySelector("#kunstner").addEventListener("click", () => {

        location.href = `kunstnerdetalje.html?kunstnerbillede=${billede.gsx$kunstnerbillede.$t}`;

    })

}


function skjulDisplay() {

    detalje.style.display = "none";
}

function toggleMenu() {
    console.log("toggleMenu");

    document.querySelector(".burgermenu").classList.toggle("hidden");

    let erSkjult = document.querySelector(".burgermenu").classList.contains("hidden");

    if (erSkjult == true) {

        document.querySelector("#menuknap").textContent = "☰";

    } else {

        document.querySelector("#menuknap").textContent = "𝘅";

    }
}
