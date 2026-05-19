document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");

  // Lock scroll immediately
  document.body.classList.add("no-scroll");

  // If already shown in this session
  if (sessionStorage.getItem("loaderShown")) {
    preloader.style.display = "none";
    document.body.classList.remove("no-scroll");
    return;
  }

  // Show loader for 2.5 seconds
  setTimeout(() => {
    preloader.style.opacity = "0";
    preloader.style.visibility = "hidden";

    sessionStorage.setItem("loaderShown", "true");

    setTimeout(() => {
      preloader.style.display = "none";
      document.body.classList.remove("no-scroll");
    }, 800);
  }, 2500);
});

// Navbar

window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar-bg");

    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

const container = document.querySelector(".tour-container");
const wrapper = container.parentElement;

let items = Array.from(container.querySelectorAll(".tour-content"));

const firstClone = items[0].cloneNode(true);
const lastClone = items[items.length - 1].cloneNode(true);
container.appendChild(firstClone);
container.insertBefore(lastClone, items[0]);

const allItems = Array.from(container.querySelectorAll(".tour-content"));
const total = allItems.length;

let current = 1;
let isTransitioning = false;

function getOffset(index) {
    const el = allItems[index];
    const containerCenter = wrapper.offsetWidth / 2;
    return -(el.offsetLeft - containerCenter + el.offsetWidth / 2);
}

function updateActive() {
    allItems.forEach(el => el.classList.remove("active"));
    allItems[current].classList.add("active");
}

function slideTo(index, animate = true) {
    current = index;

    if (!animate) {
        container.classList.add("no-transition");
        container.style.transition = "none";
        updateActive();
        container.style.transform = `translateX(${getOffset(current)}px)`;

        container.getBoundingClientRect();
        container.classList.remove("no-transition");
    } else {
        container.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
        updateActive();
        container.style.transform = `translateX(${getOffset(current)}px)`;
    }
}

function handleLoopJump() {
    if (current === total - 1) {
        current = 1;
        slideTo(current, false);
    } else if (current === 0) {
        current = total - 2;
        slideTo(current, false);
    }
    isTransitioning = false;
}

container.addEventListener("transitionend", (e) => {
    if (e.target !== container || e.propertyName !== "transform") return;
    handleLoopJump();
});

function goTo(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    slideTo(index, true);
}

function tourNext() { goTo(current + 1); }
function tourPrev() { goTo(current - 1); }

document.getElementById("nextBtn").onclick = tourNext;
document.getElementById("prevBtn").onclick = tourPrev;

updateActive();
slideTo(current, false);

const smallImages = document.querySelectorAll(".about-sm-section-img");
const bigImages = document.querySelectorAll(".about-img");

let currentIndex = 0;

document.querySelector(".about-sm-section").addEventListener("click", () => {
    
    smallImages[currentIndex].classList.remove("active");
    bigImages[currentIndex].classList.remove("active");

    currentIndex = (currentIndex + 1) % smallImages.length;

    smallImages[currentIndex].classList.add("active");
    bigImages[currentIndex].classList.add("active");
});
