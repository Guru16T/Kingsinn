const backToTop = document.querySelector('.back-to-top');

if (backToTop) {
    const updateBackToTop = () => {
        backToTop.classList.toggle('is-visible', window.scrollY > 50);
    };
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    window.addEventListener('resize', updateBackToTop);
    updateBackToTop();
}

const galleryPanes = document.querySelectorAll('.gallery-page .tab-pane');

galleryPanes.forEach((pane) => {
    const sourceImages = Array.from(pane.querySelectorAll('img'));
    const images = sourceImages.filter((image, index, list) =>
        list.findIndex((candidate) => candidate.getAttribute('src') === image.getAttribute('src')) === index
    );
    const heading = pane.querySelector('h3')?.textContent.trim() || 'Kings Inn';
    const description = pane.querySelector('.desc')?.textContent.trim() || '';
    const content = pane.querySelector('.container, .container-fluid');
    if (!content || images.length === 0) return;

    content.className = 'container gallery-category-content';
    content.replaceChildren();

    const intro = document.createElement('div');
    intro.className = 'gallery-category-heading';
    intro.innerHTML = `<span>THE KINGS INN COLLECTION</span><h2>${heading}</h2><p>${description}</p>`;

    const slider = document.createElement('div');
    slider.className = 'gallery-slider';
    slider.setAttribute('aria-label', `${heading} photo gallery`);

    const stage = document.createElement('div');
    stage.className = 'gallery-slider-stage';

    const image = document.createElement('img');
    image.className = 'gallery-slider-image';
    image.src = images[0].getAttribute('src');
    const slideName = (index) => images[index].getAttribute('alt') || `${heading}, photo ${index + 1} of ${images.length}`;
    image.alt = slideName(0);
    image.loading = 'lazy';

    const shade = document.createElement('div');
    shade.className = 'gallery-slider-shade';
    shade.setAttribute('aria-hidden', 'true');

    const label = document.createElement('div');
    label.className = 'gallery-slider-label';
    label.innerHTML = `<span class="gallery-slide-name"></span><strong><span class="gallery-current-index">01</span><i></i>${String(images.length).padStart(2, '0')}</strong>`;
    label.querySelector('.gallery-slide-name').textContent = slideName(0).toUpperCase();

    const previous = document.createElement('button');
    previous.className = 'gallery-slider-arrow gallery-slider-previous';
    previous.type = 'button';
    previous.setAttribute('aria-label', 'Previous photo');
    previous.innerHTML = '<i class="bi bi-arrow-left" aria-hidden="true"></i>';

    const next = document.createElement('button');
    next.className = 'gallery-slider-arrow gallery-slider-next';
    next.type = 'button';
    next.setAttribute('aria-label', 'Next photo');
    next.innerHTML = '<i class="bi bi-arrow-right" aria-hidden="true"></i>';

    stage.append(image, shade, label, previous, next);

    const thumbnails = document.createElement('div');
    thumbnails.className = 'gallery-slider-thumbnails';
    thumbnails.setAttribute('role', 'group');
    thumbnails.setAttribute('aria-label', `${heading} photos`);

    const thumbnailButtons = images.map((source, index) => {
        const button = document.createElement('button');
        button.className = 'gallery-slider-thumb';
        if (index === 0) button.classList.add('active');
        button.type = 'button';
        button.setAttribute('aria-label', `Show photo ${index + 1}`);
        button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');

        const thumb = document.createElement('img');
        thumb.src = source.getAttribute('src');
        thumb.alt = '';
        thumb.loading = 'lazy';
        button.appendChild(thumb);
        thumbnails.appendChild(button);
        return button;
    });

    slider.append(stage, thumbnails);
    content.append(intro, slider);

    let current = 0;
    const show = (index) => {
        current = (index + images.length) % images.length;
        image.classList.add('is-changing');
        window.setTimeout(() => {
            image.src = images[current].getAttribute('src');
            image.alt = slideName(current);
            label.querySelector('.gallery-slide-name').textContent = slideName(current).toUpperCase();
            label.querySelector('.gallery-current-index').textContent = String(current + 1).padStart(2, '0');
            thumbnailButtons.forEach((button, buttonIndex) => {
                const selected = buttonIndex === current;
                button.classList.toggle('active', selected);
                button.setAttribute('aria-pressed', String(selected));
            });
            image.classList.remove('is-changing');
        }, 180);
    };

    previous.addEventListener('click', () => show(current - 1));
    next.addEventListener('click', () => show(current + 1));
    thumbnailButtons.forEach((button, index) => button.addEventListener('click', () => show(index)));

    let paused = false;
    slider.addEventListener('mouseenter', () => { paused = true; });
    slider.addEventListener('mouseleave', () => { paused = false; });
    slider.addEventListener('focusin', () => { paused = true; });
    slider.addEventListener('focusout', (event) => {
        if (!slider.contains(event.relatedTarget)) paused = false;
    });

    window.setInterval(() => {
        if (!paused && pane.classList.contains('active') && !document.hidden && images.length > 1) show(current + 1);
    }, 5000);
});
