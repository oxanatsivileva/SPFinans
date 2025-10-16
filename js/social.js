// Количесво индикаторов в зависимости от количества фото в карусели на странице social
const carousels = document.querySelectorAll('.carousel');
carousels.forEach((carousel) => {
	const slides = carousel.querySelectorAll('.carousel-item');
	const indicatorsContainer = carousel.querySelector('.carousel-indicators');
	slides.forEach((slide, index) => {
		const button = document.createElement('button');
		button.type = 'button';
		button.setAttribute('data-bs-target', `#${carousel.id}`);
		button.setAttribute('data-bs-slide-to', index);
		if (index === 0) {
			button.classList.add('active');
			button.setAttribute('aria-current', 'true');
		}
		indicatorsContainer.appendChild(button);
	});
});
