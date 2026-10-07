const carousel = document.querySelector('#carouselExampleCaptions');
const thumbs = document.querySelectorAll('.thumb-item');
const sidebar = document.getElementById('offcanvasRight');

if (sidebar) {
    sidebar.addEventListener('show.bs.offcanvas', () => {
        document.body.classList.add('offcanvas-open');
        document.documentElement.classList.add('offcanvas-open');
    });

    sidebar.addEventListener('hidden.bs.offcanvas', () => {
        document.body.classList.remove('offcanvas-open');
        document.documentElement.classList.remove('offcanvas-open');
    });
}

carousel.addEventListener('slide.bs.carousel', function (e) {

    thumbs.forEach(t => t.classList.remove('active'));
    thumbs[e.to].classList.add('active');

});
