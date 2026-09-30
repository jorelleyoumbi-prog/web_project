
let menu = document.querySelector('#menu-bars');
let navbar = document.querySelector('.navbar');

if(menu && navbar){
   menu.onclick = () => {
   navbar.classList.toggle('active');  
    menu.classList.toggle('fa-times');  
  };
}


let section = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header .navbar a');

window.onscroll = () => {
    if(navbar && menu){
        navbar.classList.remove('active');  
        menu.classList.remove('fa-times');
    }
      

    section.forEach(sec =>{
        let top = window.scrollY;
        let height = sec.offsetHeight;
        let offset = sec.offsetTop - 150;
        let id = sec.getAttribute('id');
        
        if(top >= offset && top < offset + height)
            {
            navLinks.forEach(links =>{
                links.classList.remove('active');
                const currentLink = document.querySelector(`header .navbar a[href*="${id}"]`);
                if (currentLink) currentLink.classList.add('active');
            });
        }
    });
};

const searchIcon = document.querySelector('#search-icon');
const searchForm = document.querySelector('#search-form');
const closeBtn = document.querySelector('#close');

if (searchIcon && searchForm) {
  searchIcon.onclick = () => {
    searchForm.classList.toggle('active');
  };
}

if (closeBtn && searchForm) {
  closeBtn.onclick = () => {
    searchForm.classList.remove('active');
  };
}

if (document.querySelector(".home-slider")) {
  new Swiper(".home-slider", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: { delay: 7500, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true },
    loop: true,
  });
}

if (document.querySelector(".review-slider")) {
  const slides = document.querySelectorAll(".review-slider .swiper-slide");
  new Swiper(".review-slider", {
    spaceBetween: 20,
    centeredSlides: true,
    autoplay: { delay: 7500, disableOnInteraction: false },
    loop: slides.length > 2, // Active la boucle uniquement si assez de slides
    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });
}


document.addEventListener("DOMContentLoaded", function() {
  const bookingForm = document.getElementById("book-form");

  if (bookingForm) {
    bookingForm.addEventListener("submit", function() {
      // ici on NE bloque plus le submit
      console.log("Formulaire de réservation envoyé !");
    });
  }
});

//  Recherche dynamique dans le menu 
// === Recherche dynamique dans le menu ===
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("#search-box");
  const menuItems = document.querySelectorAll(".menu .box");
  const closeIcon = document.querySelector("#close");

  if (!searchInput || menuItems.length === 0) return;

  // Filtrage dynamique
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();

    menuItems.forEach(item => {
      const title = item.querySelector("h3").textContent.toLowerCase();
      item.style.display = title.includes(query) ? "inline-block" : "none";
    });
  });

  // Effacement rapide du champ de recherche
  if (closeIcon) {
    closeIcon.addEventListener("click", () => {
      searchInput.value = "";
      menuItems.forEach(item => (item.style.display = "inline-block"));
    });
  }
});

 