// ХЭДЕР НАЧАЛО

// Хэдер при скролле
// let scrollHandler = null;
// const handleHeaderScroll = () => {
// 	const header = document.getElementById('header');
// 	if (!header) return;
// 	if (window.scrollY > 100) {
// 		header.classList.add('scrolled-menu');
// 	} else {
// 		header.classList.remove('scrolled-menu');
// 	}
// };
// const initHeaderScroll = () => {
// 	const header = document.getElementById('header');
// 	if (!header) return;
// 	if (scrollHandler) {
// 		window.removeEventListener('scroll', scrollHandler);
// 		scrollHandler = null;
// 	}
// 	if (document.documentElement.clientWidth > 991) {
// 		scrollHandler = handleHeaderScroll;
// 		window.addEventListener('scroll', scrollHandler);
// 		handleHeaderScroll();
// 	} else {
// 		header.classList.remove('scrolled-menu');
// 	}
// };
// const debounce = (func, wait) => {
// 	let timeout;
// 	return function executedFunction(...args) {
// 		const later = () => {
// 			clearTimeout(timeout);
// 			func(...args);
// 		};
// 		clearTimeout(timeout);
// 		timeout = setTimeout(later, wait);
// 	};
// };
// initHeaderScroll();
// window.addEventListener('resize', debounce(initHeaderScroll, 100));

// меню бургер
const templateMenu = document.querySelector('.menu');
if (templateMenu) {
	if (document.querySelector('.menu__icon')) {
		document.querySelectorAll('.menu__icon').forEach((el) => {
			el.addEventListener('click', () => {
				document.querySelector('body').classList.toggle('lock');
				templateMenu.classList.toggle('menu--open');
			});
		});
	}
	if (templateMenu.querySelector('a')) {
		templateMenu.querySelectorAll('a').forEach((el) => {
			el.addEventListener('click', () => {
				document.querySelector('body').classList.remove('lock');
				templateMenu.classList.remove('menu--open');
			});
		});
	}
}

// темная тема
const theme = document.querySelector('.switch > input');
if (theme) {
	const switching = () => {
		document.body.classList.toggle('dark', theme.checked);
	};
	switching();
	theme.addEventListener('input', switching);
}

// одинаковая длина вложенных пунктов меню в хедере
document.querySelectorAll('[data-inner-menu]').forEach((menu) => {
	const list = menu.querySelectorAll(':scope > li');
	let maxWidth = list[0].clientWidth;
	list.forEach((item) => {
		const width = item.clientWidth;
		if (width > maxWidth) {
			maxWidth = width;
		}
	});
	list.forEach((item) => {
		item.style.flexBasis = `${maxWidth}px`;
	});
});

// ХЭДЕР КОНЕЦ

// ГЛАВНАЯ

// количество слайдов в карусели на главной
let counter = document.querySelector('.main-hero__counter');
let myCarousel = document.querySelector('#carouselExampleControls');
if (counter) {
	// позиционирование
	update = () => {
		counter.style.left = `${
			parseInt(
				window
					.getComputedStyle(document.querySelector('.main-hero .container'))
					.getPropertyValue('margin-left')
			) +
			parseInt(
				window
					.getComputedStyle(document.querySelector('.main-hero .container'))
					.getPropertyValue('padding-left')
			)
		}px`;
		counter.style.top = `${
			document.querySelector('.main-hero__text').offsetTop
		}px`;

		// подсчёт
		counter.innerText = `1 / ${
			document.querySelectorAll('.carousel-item').length
		}`;
		if (myCarousel) {
			myCarousel.addEventListener('slid.bs.carousel', (slide) => {
				counter.innerText = `${slide.to + 1} / ${
					document.querySelectorAll('.carousel-item').length
				}`;
			});
		}
	};
	update();
	window.addEventListener('resize', () => {
		update();
	});
}

// Калькулятор
const ranges = document.querySelectorAll('.calculator__range');
if (ranges.length) {
	// Оформление ползунков
	const isMobile = window.innerWidth < 992;
	const rangesInstances = {}; // инициализированные ползунки
	const rangesConfigs = {
		'.calculator__sum-slider': {
			start: 1350000,
			step: 1,
			range: { min: 0, '50%': isMobile ? 750000 : 1500000, max: 3000000 },
			format: { decimals: 0, thousand: ' ', suffix: '' },
		},
		'.calculator__days-slider': {
			start: 160,
			step: 1,
			range: { min: 1, max: 365 },
			format: { decimals: 0 },
		},
		'.calculator__percent-slider': {
			start: 0.15,
			step: 0.01,
			range: { min: 0.1, '50%': 0.25, max: 0.5 },
			format: { decimals: 2 },
		},
	};
	const createSlider = (range, config) => {
		const instance = noUiSlider.create(range, {
			...config,
			// tooltips: true,
			connect: 'lower',
			format: wNumb(config.format),
		});
		const key = range.classList[1];
		rangesInstances[key] = instance;
	};
	ranges.forEach((range) => {
		Object.entries(rangesConfigs).forEach(([selector, config]) => {
			if (range.matches(selector)) createSlider(range, config);
		});
	});

	const form = document.querySelector('.calculator');
	if (form) {
		// форматирование для полей
		const sumInput = form.querySelector('#calculatorSumInput');
		const daysInput = form.querySelector('#calculatorDaysInput');
		const percentInput = form.querySelector('#calculatorPercentInput');
		if (sumInput && daysInput && percentInput) {
			const cleavePriceSetting = {
				numeral: true,
				numeralThousandsGroupStyle: 'thousand',
				delimiter: ' ',
			};
			const cleaveSum = new Cleave(sumInput, cleavePriceSetting);
			const cleaveDays = new Cleave(daysInput, { numeral: true });
			const cleavePercent = new Cleave(percentInput, cleavePriceSetting);
			calculation();

			// Проброс значений между полями и ползунками
			form.addEventListener('input', function (e) {
				let value = 0;
				if (e.target.matches('#calculatorSumInput')) {
					value = +cleaveSum.getRawValue();
					rangesInstances['calculator__sum-slider'].set(value);
					if (value > e.target.max) {
						cleaveSum.setRawValue(e.target.max);
					}
				} else if (e.target.matches('#calculatorDaysInput')) {
					value = +cleaveDays.getRawValue();
					rangesInstances['calculator__days-slider'].set(value);
					if (value > e.target.max) {
						cleaveDays.setRawValue(e.target.max);
					}
				} else if (e.target.matches('#calculatorPercentInput')) {
					value = +cleavePercent.getRawValue();
					rangesInstances['calculator__percent-slider'].set(value);
					if (value > e.target.max) {
						cleavePercent.setRawValue(e.target.max);
					}
				}
				calculation();
			});
			Object.keys(rangesInstances).forEach((range) => {
				rangesInstances[range].on('slide', () => {
					switch (range) {
						case 'calculator__sum-slider':
							cleaveSum.setRawValue(parseInt(rangesInstances[range].get(true)));
							break;
						case 'calculator__days-slider':
							cleaveDays.setRawValue(
								parseInt(rangesInstances[range].get(true))
							);
							break;
						case 'calculator__percent-slider':
							cleavePercent.setRawValue(rangesInstances[range].get());
							break;
					}
					calculation();
				});
			});

			// Подсчёт
			function calculation() {
				const sumValue = +cleaveSum.getRawValue();
				const daysValue = +cleaveDays.getRawValue();
				const percentValue = +cleavePercent.getRawValue();
				const s = (sumValue / 100) * percentValue;
				const differenceValue = s * daysValue;
				const resultValue = sumValue + Number(differenceValue);
				updateResult(
					sumValue,
					daysValue,
					percentValue,
					differenceValue,
					resultValue
				);
			}

			// Вставка значений
			function updateResult(
				sumValue,
				daysValue,
				percentValue,
				differenceValue,
				resultValue
			) {
				const RESULTOUTPUT = document.querySelector(
					'[data-input="calculatorResultInput"]'
				);
				const SUMOUTPUT = document.querySelector(
					'[data-input="calculatorSumInput"]'
				);
				const DAYSOUTPUT = document.querySelector(
					'[data-input="calculatorDaysInput"]'
				);
				const PERCENTOUTPUT = document.querySelector(
					'[data-input="calculatorPercentInput"]'
				);
				const DIFFERENCEOUTPUT = document.querySelector(
					'[data-input="calculatorDifferenceInput"]'
				);
				const priceFormatter = new Intl.NumberFormat('ru-RU', {
					style: 'currency',
					currency: 'RUB',
					maximumFractionDigits: 0,
				});
				const percentFormatter = new Intl.NumberFormat('ru-RU', {
					style: 'percent',
					maximumFractionDigits: 2,
				});
				RESULTOUTPUT.innerText = priceFormatter.format(resultValue);
				SUMOUTPUT.innerText = sumValue;
				DAYSOUTPUT.innerText = daysValue;
				PERCENTOUTPUT.innerText = percentFormatter.format(percentValue / 100);
				DIFFERENCEOUTPUT.innerText = priceFormatter.format(differenceValue);
			}
		}
	}

	// Обработчик ресайза для переинициализации
	let resizeTimeout;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			if (window.innerWidth < 992 !== isMobile) {
				location.reload(); // или переинициализация слайдеров
			}
		}, 250);
	});
}

// скрытие текста в блоке main-conditions
if (document.querySelector('[data-height]')) {
	const conditions = document.querySelector('.main-conditions');
	let marginMobile = 0;

	if (document.documentElement.clientWidth < 992) {
		marginMobile = 180;
	}

	if (conditions) {
		const conditionsInner = conditions.querySelector('.main-conditions__inner');
		const row = conditions.querySelector('[data-height]');
		const btn = conditions.querySelector('.main-conditions__more span');
		if (conditionsInner && row && btn) {
			const dataHeight = +row.dataset.height;
			const height = conditionsInner.offsetHeight;
			const text = btn.innerText;
			conditionsInner.style.height = `${
				row.offsetTop + dataHeight + marginMobile
			}px`;
			btn.addEventListener('click', (e) => {
				if (!e.target.closest('.main-conditions--open')) {
					conditionsInner.style.height = `${height}px`;
					conditions.classList.add('main-conditions--open');
					e.target.innerText = 'Свернуть';
				} else {
					conditionsInner.style.height = `${
						row.offsetTop + dataHeight + marginMobile
					}px`;
					conditions.classList.remove('main-conditions--open');
					e.target.innerText = text;
				}
			});
		}
	}
}

// скрытие текста в блоке main-page__reviews
document
	.querySelectorAll('.reviews-page__section .review__text')
	.forEach((item) => {
		if (item.scrollHeight > item.clientHeight) {
			const INITIAL_TEXT = 'Читать далее';
			const ALTERNATIVE_TEXT = 'Скрыть';
			const moreBtn = document.createElement('span');
			const comment = item.closest('.review__item');
			comment.classList.add('review__item--hidden');
			if (moreBtn && comment) {
				moreBtn.classList.add('review__more');
				moreBtn.innerText = INITIAL_TEXT;
				moreBtn.addEventListener('click', () => {
					if (item.closest('.review__item--hidden')) {
						comment.classList.remove('review__item--hidden');
						comment.classList.add('review__item--open');
						moreBtn.innerText = ALTERNATIVE_TEXT;
					} else {
						comment.classList.remove('review__item--open');
						comment.classList.add('review__item--hidden');
						moreBtn.innerText = INITIAL_TEXT;
					}
				});
				comment.append(moreBtn);
			}
		}
	});

// скрытие текста в блоке main-page__reviews
document.querySelectorAll('.review__text').forEach((item) => {
	if (item.scrollHeight > item.clientHeight) {
		const parent = item.closest('.review__item');
		if (parent.querySelector('.review__more')) {
			parent.querySelector('.review__more').style.display = 'inline-block';
		}
		parent.classList.add('review__item--hidden');
	}
});

// Карта
if (document.getElementById('map')) {
	window.map = null;
	window.marker = null;

	// Данные городов
	const cities = {
		spb: {
			center: [30.315868, 59.939095],
			marker: [30.315868, 59.939095],
			zoom: 11,
		},
		msk: {
			center: [37.617698, 55.755864],
			marker: [37.617698, 55.755864],
			zoom: 10,
		},
		kazan: {
			center: [49.108891, 55.796289],
			marker: [49.108891, 55.796289],
			zoom: 16,
		},
		// Другие города по аналогии
	};

	// Главная функция, вызывается при запуске скрипта
	main();
	async function main() {
		// ожидание загрузки модулей
		await ymaps3.ready;
		const {
			YMap,
			YMapDefaultSchemeLayer,
			YMapDefaultFeaturesLayer,
			YMapMarker,
		} = ymaps3;

		// Импорт модулей для элементов управления на карте
		const { YMapZoomControl, YMapGeolocationControl } = await ymaps3.import(
			'@yandex/ymaps3-controls@0.0.1'
		);

		// Получаем выбранный город из селекта
		const citySelect = document.getElementById('citySelect');
		const selectedCity = citySelect.value;
		const currentCity = cities[selectedCity];

		// Объект с параметрами центра и зумом карты
		const LOCATION = {
			center: currentCity.center,
			zoom: currentCity.zoom,
		};

		// Создание объекта карты
		map = new YMap(document.getElementById('map'), {
			location: LOCATION,
		});

		// Добавление слоев на карту
		map.addChild((scheme = new YMapDefaultSchemeLayer()));
		map.addChild(new YMapDefaultFeaturesLayer());

		// Создание маркера
		const el = document.createElement('img');
		el.className = 'main-map__marker';
		el.src = 'img/marker.svg';
		el.title = 'Маркер';

		// При клике на маркер меняем центр карты на LOCATION с заданным duration
		el.onclick = () => map.update({ location: { ...LOCATION, duration: 400 } });

		// Контейнер для элементов маркера
		const imgContainer = document.createElement('div');
		imgContainer.appendChild(el);

		// Создаем маркер и сохраняем ссылку на него
		marker = new YMapMarker({ coordinates: currentCity.marker }, imgContainer);

		// Добавление маркера на карту
		map.addChild(marker);

		// Обработчик изменения города
		citySelect.addEventListener('change', function () {
			const selectedCity = this.value;
			const cityData = cities[selectedCity];

			if (cityData) {
				// Обновляем местоположение карты
				map.setLocation({
					center: cityData.center,
					zoom: cityData.zoom,
				});

				// Удаляем старый маркер
				map.removeChild(marker);

				// Создаем новый маркер с новыми координатами
				marker = new YMapMarker({ coordinates: cityData.marker }, imgContainer);

				// Добавляем новый маркер
				map.addChild(marker);
			}
		});
	}
}

// Открывашка текста
const expandButton = document.querySelector('.expand-button');
const textContent = document.querySelector('.text-content');
if (expandButton && textContent) {
	expandButton.addEventListener('click', () => {
		textContent.classList.toggle('truncated-text');
		textContent.classList.toggle('expanded-text');

		if (expandButton.innerText === 'Читать далее') {
			expandButton.innerText = 'Свернуть';
		} else {
			expandButton.innerText = 'Читать далее';
		}
	});
}
