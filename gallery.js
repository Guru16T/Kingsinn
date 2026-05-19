const carousel = document.querySelector('#carouselExampleCaptions');
const thumbs = document.querySelectorAll('.thumb-item');

carousel.addEventListener('slide.bs.carousel', function (e) {

    thumbs.forEach(t => t.classList.remove('active'));
    thumbs[e.to].classList.add('active');

});