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

const sidebar = document.getElementById("offcanvasRight");

if (sidebar) {
    sidebar.addEventListener("show.bs.offcanvas", () => {
        document.body.classList.add("offcanvas-open");
        document.documentElement.classList.add("offcanvas-open");
    });

    sidebar.addEventListener("hidden.bs.offcanvas", () => {
        document.body.classList.remove("offcanvas-open");
        document.documentElement.classList.remove("offcanvas-open");
    });
}

window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar-bg");

    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

const homeBackToTop = document.querySelector(".back-to-top");

if (homeBackToTop) {
    const updateHomeBackToTop = () => {
        homeBackToTop.classList.toggle("is-visible", window.scrollY > 50);
    };
    window.addEventListener("scroll", updateHomeBackToTop, { passive: true });
    window.addEventListener("resize", updateHomeBackToTop);
    updateHomeBackToTop();
}

const homeSection = document.querySelector(".home-bg");
let homeParallaxFrame = null;

if (homeSection) {
    window.addEventListener("scroll", () => {
        if (homeParallaxFrame !== null) return;
        homeParallaxFrame = window.requestAnimationFrame(() => {
            homeSection.style.setProperty("--home-parallax-y", `${window.scrollY * 0.16}px`);
            homeParallaxFrame = null;
        });
    }, { passive: true });
}

const staySection = document.querySelector(".stay-section");
let stayParallaxFrame = null;

if (staySection) {
    window.addEventListener("scroll", () => {
        if (stayParallaxFrame !== null) return;
        stayParallaxFrame = window.requestAnimationFrame(() => {
            const sectionTop = staySection.getBoundingClientRect().top + window.scrollY;
            staySection.style.setProperty("--stay-parallax-y", `${(window.scrollY - sectionTop) * 0.16}px`);
            stayParallaxFrame = null;
        });
    }, { passive: true });
}

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

const stayRequestForm = document.getElementById("stayRequestForm");

if (stayRequestForm) {
    const checkInDate = document.getElementById("checkInDate");
    const checkOutDate = document.getElementById("checkOutDate");
    const checkInTrigger = document.getElementById("checkInTrigger");
    const checkOutTrigger = document.getElementById("checkOutTrigger");
    const calendar = document.getElementById("stayCalendar");
    const calendarMonth = document.getElementById("calendarMonth");
    const calendarDays = document.getElementById("calendarDays");
    const bookingFormError = document.getElementById("bookingFormError");
    const guestCountInput = document.getElementById("guestCount");
    if (calendar.parentElement !== document.body) document.body.appendChild(calendar);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const parseDate = (value) => {
        if (!value) return null;
        const [year, month, day] = value.split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    const showDate = (value) => value
        ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(parseDate(value))
        : "Choose a date";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayValue = formatDate(today);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let activeDateField = null;
    let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    function getMinimumDate() {
        if (activeDateField === "checkout" && checkInDate.value) {
            const nextDay = parseDate(checkInDate.value);
            nextDay.setDate(nextDay.getDate() + 1);
            return formatDate(nextDay);
        }
        return activeDateField === "checkout" ? formatDate(tomorrow) : todayValue;
    }

    function closeCalendar() {
        calendar.hidden = true;
        checkInTrigger.setAttribute("aria-expanded", "false");
        checkOutTrigger.setAttribute("aria-expanded", "false");
        activeDateField = null;
    }

    function setBookingError(message = "") {
        bookingFormError.textContent = message;
        bookingFormError.hidden = !message;
    }

    function positionCalendar() {
        if (calendar.hidden || !activeDateField) return;

        const trigger = activeDateField === "checkin" ? checkInTrigger : checkOutTrigger;
        const triggerRect = trigger.getBoundingClientRect();
        const viewportPadding = 12;
        const gap = 10;
        const maxHeight = Math.max(100, window.innerHeight - viewportPadding * 2);
        calendar.style.maxHeight = `${Math.min(360, maxHeight)}px`;

        const calendarRect = calendar.getBoundingClientRect();
        const spaceBelow = window.innerHeight - triggerRect.bottom - gap - viewportPadding;
        const spaceAbove = triggerRect.top - gap - viewportPadding;
        const showBelow = spaceBelow >= calendarRect.height || spaceBelow >= spaceAbove;
        let top = showBelow
            ? triggerRect.bottom + gap
            : triggerRect.top - calendarRect.height - gap;
        top = Math.max(viewportPadding, Math.min(top, window.innerHeight - calendarRect.height - viewportPadding));

        const maxLeft = Math.max(viewportPadding, window.innerWidth - calendarRect.width - viewportPadding);
        const left = Math.max(viewportPadding, Math.min(triggerRect.left, maxLeft));
        calendar.style.top = `${top}px`;
        calendar.style.left = `${left}px`;
    }

    function renderCalendar() {
        const year = visibleMonth.getFullYear();
        const month = visibleMonth.getMonth();
        const firstWeekday = new Date(year, month, 1).getDay();
        const monthLength = new Date(year, month + 1, 0).getDate();
        const selectedDate = activeDateField === "checkin" ? checkInDate.value : checkOutDate.value;
        const minimumDate = getMinimumDate();

        calendarMonth.textContent = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(visibleMonth);
        calendarDays.replaceChildren();

        for (let blank = 0; blank < firstWeekday; blank += 1) {
            const spacer = document.createElement("span");
            spacer.className = "calendar-day-spacer";
            spacer.setAttribute("aria-hidden", "true");
            calendarDays.appendChild(spacer);
        }

        for (let day = 1; day <= monthLength; day += 1) {
            const date = new Date(year, month, day);
            const value = formatDate(date);
            const dayButton = document.createElement("button");
            dayButton.type = "button";
            dayButton.className = "calendar-day";
            dayButton.textContent = String(day);
            dayButton.setAttribute("aria-label", new Intl.DateTimeFormat("en-IN", { dateStyle: "full" }).format(date));
            dayButton.disabled = value < minimumDate;
            if (value === selectedDate) dayButton.classList.add("selected");
            if (value === todayValue) dayButton.classList.add("today");

            dayButton.addEventListener("click", () => {
                if (activeDateField === "checkin") {
                    checkInDate.value = value;
                    document.getElementById("checkInDisplay").textContent = showDate(value);
                    if (checkOutDate.value && checkOutDate.value <= value) {
                        checkOutDate.value = "";
                        document.getElementById("checkOutDisplay").textContent = showDate("");
                    }
                } else {
                    checkOutDate.value = value;
                    document.getElementById("checkOutDisplay").textContent = showDate(value);
                }
                setBookingError();
                closeCalendar();
            });

            calendarDays.appendChild(dayButton);
        }
    }

    function openCalendar(field) {
        const trigger = field === "checkin" ? checkInTrigger : checkOutTrigger;
        if (!calendar.hidden && activeDateField === field) {
            closeCalendar();
            return;
        }

        activeDateField = field;
        const currentValue = field === "checkin" ? checkInDate.value : checkOutDate.value;
        const initialDate = parseDate(currentValue) || (field === "checkout" && checkInDate.value
            ? parseDate(checkInDate.value)
            : today);
        visibleMonth = new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
        checkInTrigger.setAttribute("aria-expanded", String(field === "checkin"));
        checkOutTrigger.setAttribute("aria-expanded", String(field === "checkout"));
        if (calendar.parentElement !== document.body) document.body.appendChild(calendar);
        calendar.hidden = false;
        renderCalendar();
        positionCalendar();
        const firstAvailableDay = calendarDays.querySelector(".calendar-day:not(:disabled)");
        (firstAvailableDay || trigger).focus({ preventScroll: true });
    }

    checkInTrigger.addEventListener("click", () => openCalendar("checkin"));
    checkOutTrigger.addEventListener("click", () => openCalendar("checkout"));
    document.getElementById("calendarPrev").addEventListener("click", () => {
        visibleMonth.setMonth(visibleMonth.getMonth() - 1);
        renderCalendar();
        positionCalendar();
    });
    document.getElementById("calendarNext").addEventListener("click", () => {
        visibleMonth.setMonth(visibleMonth.getMonth() + 1);
        renderCalendar();
        positionCalendar();
    });

    guestCountInput.addEventListener("keydown", (event) => {
        if (event.key.length === 1 && !/[0-9]/.test(event.key) && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
        }
    });

    guestCountInput.addEventListener("input", () => {
        guestCountInput.value = guestCountInput.value.replace(/[^0-9]/g, "");
        setBookingError();
    });

    document.addEventListener("click", (event) => {
        if (!stayRequestForm.contains(event.target) && !calendar.contains(event.target) && !calendar.hidden) closeCalendar();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !calendar.hidden) closeCalendar();
    });
    window.addEventListener("scroll", () => {
        if (!calendar.hidden) closeCalendar();
    }, { passive: true });
    window.addEventListener("resize", positionCalendar);

    stayRequestForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const guestCount = guestCountInput.value;
        if (!checkInDate.value || !checkOutDate.value) {
            setBookingError("Please choose both your check-in and check-out dates.");
            (!checkInDate.value ? checkInTrigger : checkOutTrigger).focus();
            return;
        }
        if (checkOutDate.value <= checkInDate.value) {
            setBookingError("Check-out must be after check-in.");
            checkOutTrigger.focus();
            return;
        }
        if (!/^\d+$/.test(guestCount) || Number(guestCount) < 1) {
            setBookingError("Enter at least one person using numbers only.");
            guestCountInput.focus();
            return;
        }

        const message = [
            "Hello Kings Inn, I would like to request a stay.",
            `Check-in: ${showDate(checkInDate.value)}`,
            `Check-out: ${showDate(checkOutDate.value)}`,
            `People: ${guestCount}`,
            "Please confirm availability."
        ].join("\n");

        window.open(`https://wa.me/918095877711?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    });
}
