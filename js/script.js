// Хэдер при скролле
let scrollHandler = null;
const handleHeaderScroll = () => {
	const header = document.getElementById('header');
	if (!header) return;
	if (window.scrollY > 100) {
		header.classList.add('scrolled-menu');
	} else {
		header.classList.remove('scrolled-menu');
	}
};
const initHeaderScroll = () => {
	const header = document.getElementById('header');
	if (!header) return;
	if (scrollHandler) {
		window.removeEventListener('scroll', scrollHandler);
		scrollHandler = null;
	}
	if (document.documentElement.clientWidth > 991) {
		scrollHandler = handleHeaderScroll;
		window.addEventListener('scroll', scrollHandler);
		handleHeaderScroll();
	} else {
		header.classList.remove('scrolled-menu');
	}
};
const debounce = (func, wait) => {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};
initHeaderScroll();
window.addEventListener('resize', debounce(initHeaderScroll, 100));

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
const ranges = document.querySelectorAll('.calculator input[type="range"]');
const numbers = document.querySelectorAll('.calculator input[type="text"]');
if (ranges.length && numbers.length) {
	const spaceDigits = (number) => {
		return number.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
	};

	const updateResult = () => {
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

		const sumInput = document.getElementById('calculatorSumInput');
		const daysInput = document.getElementById('calculatorDaysInput');
		const percentInput = document.getElementById('calculatorPercentInput');

		if (sumInput && daysInput && percentInput) {
			const sumValue = Number(sumInput.value.replace(/ /g, ''));
			const daysValue = Number(daysInput.value);
			const percentValue = Number(percentInput.value);
			const s = (sumValue / 100) * percentValue;
			const differenceValue = s * daysValue;
			const resultValue = sumValue + Number(differenceValue);

			RESULTOUTPUT.innerText = spaceDigits(
				resultValue.toFixed(2).replace(/\.00$/, '')
			);
			SUMOUTPUT.innerText = spaceDigits(sumValue);
			DAYSOUTPUT.innerText = daysValue;
			PERCENTOUTPUT.innerText = percentValue;
			DIFFERENCEOUTPUT.innerText = spaceDigits(
				differenceValue.toFixed(2).replace(/\.00$/, '')
			);
		}
	};

	ranges.forEach((input) => {
		const output = input.parentElement.querySelector('input[type="text"]');
		const min = Number(input.min);
		const max = Number(input.max);
		const decorationInput = () => {
			const value = Number(input.value);
			const valuePercent = `${100 - ((max - value) / (max - min)) * 100}%`;
			input.style.backgroundSize = `${valuePercent} 100%`;
		};
		const valueInputToOutput = () => {
			output.value = spaceDigits(input.value);
		};
		const valueOutputToInput = () => {
			const valueNum = Number(String(output.value).replace(/ /g, ''));
			if (valueNum >= min && valueNum <= max) {
				input.value = valueNum;
				output.classList.remove('--error');
			} else {
				output.classList.add('--error');
			}
		};

		valueInputToOutput();
		decorationInput();
		updateResult();

		input.addEventListener('input', (e) => {
			valueInputToOutput();
			decorationInput();
			updateResult();

			if (e.target.matches('.calculator__percent-slider')) {
				const range = Number(e.target.max) - Number(e.target.min);
				// const current = (Number(e.target.value) * 100) / range;
				const value = e.target.value;
				const percent = (
					((Number(value) - Number(e.target.min)) * 100) /
					range
				).toFixed(2);
				console.log(`диапазон: ${range}`);
				console.log(`значение: ${value}`);
				console.log(`процент: ${percent}`);
			}
		});
		output.addEventListener('input', () => {
			valueOutputToInput();
			decorationInput();
			updateResult();
		});
		output.addEventListener('keypress', function (e) {
			const pattern = new RegExp('^' + this.pattern + '$');
			const testValue = this.value + e.key;
			if (!pattern.test(testValue)) {
				e.preventDefault();
			}
			valueOutputToInput();
			decorationInput();
		});
		output.addEventListener('focusin', () => {
			output.value = Number(String(output.value).replace(/ /g, ''));
		});
		output.addEventListener('focusout', () => {
			output.value = spaceDigits(output.value);
		});
	});
}

// const calculatorSumSlider = document.getElementById('calculatorSumSlider');
// const calculatorSumInput = document.getElementById('calculatorSumInput');

// calculatorSumSlider.addEventListener('input', () => {
// 	calculatorSumInput.value = calculatorSumSlider.value;
// });

// calculatorSumInput.addEventListener('input', () => {
// 	calculatorSumSlider.value = calculatorSumInput.value;
// });

// const calculatorDaysSlider = document.getElementById('calculatorDaysSlider');
// const calculatorDaysInput = document.getElementById('calculatorDaysInput');

// calculatorDaysSlider.addEventListener('input', () => {
// 	calculatorDaysInput.value = calculatorDaysSlider.value;
// });

// calculatorDaysInput.addEventListener('input', () => {
// 	calculatorDaysSlider.value = calculatorDaysInput.value;
// });

// скрытие текста в блоке main-conditions
const conditions = document.querySelector('.main-conditions');
let margin = 0;
if (document.documentElement.clientWidth < 992) {
	margin = 180;
}
if (conditions) {
	const conditionsInner = document.querySelector('.main-conditions__inner');
	const row = conditions.querySelector('[data-height]');
	const list = conditions.querySelector('.main-conditions__list');
	const span = conditions.querySelector('.main-conditions__more span');
	if (conditionsInner && row && list && span) {
		const dataHeight = +row.dataset.height;
		const height = conditionsInner.offsetHeight;
		const text = span.innerText;
		conditionsInner.style.height = `${row.offsetTop + dataHeight + margin}px`;
		span.style.marginLeft = `${
			list.offsetLeft +
			document.querySelector('.main-conditions__inner > .container').offsetLeft
		}px`;
		window.addEventListener('resize', () => {
			span.style.marginLeft = `${
				list.offsetLeft +
				document.querySelector('.main-conditions__inner > .container')
					.offsetLeft
			}px`;
		});
		span.addEventListener('click', (e) => {
			if (!e.target.closest('.main-conditions--open')) {
				conditionsInner.style.height = `${height}px`;
				conditions.classList.add('main-conditions--open');
				e.target.innerText = 'Свернуть';
			} else {
				conditionsInner.style.height = `${row.offsetTop + dataHeight}px`;
				conditions.classList.remove('main-conditions--open');
				e.target.innerText = text;
			}
		});
	}
}

// скрытие текста в блоке main-page__reviews
// document.querySelectorAll('.review__text').forEach((item) => {
// 	if (item.scrollHeight > item.clientHeight) {
// 		const INITIAL_TEXT = 'Читать далее';
// 		const ALTERNATIVE_TEXT = 'Скрыть';
// 		const more = document.createElement('span');
// 		const parent = item.closest('.review__item');
// 		parent.classList.add('review__item--hidden');
// 		if (more && parent) {
// 			more.classList.add('review__more');
// 			more.innerText = INITIAL_TEXT;
// 			more.addEventListener('click', () => {
// 				if (item.closest('.review__item--hidden')) {
// 					parent.classList.remove('review__item--hidden');
// 					parent.classList.add('review__item--open');
// 					more.innerText = ALTERNATIVE_TEXT;
// 				} else {
// 					parent.classList.remove('review__item--open');
// 					parent.classList.add('review__item--hidden');
// 					more.innerText = INITIAL_TEXT;
// 				}
// 			});
// 			parent.append(more);
// 		}
// 	}
// });

// скрытие текста в блоке main-page__reviews
document.querySelectorAll('.review__text').forEach((item) => {
	if (item.scrollHeight > item.clientHeight) {
		const parent = item.closest('.review__item');
		parent.querySelector('.review__more').style.display = 'inline-block';
		parent.classList.add('review__item--hidden');
	}
});

// карта
if (document.getElementById('map')) {
	window.map = null;
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

		// Координаты центра карты
		const CENTER_COORDINATES = [30.3812526132812, 59.94480848799107];
		// координаты метки на карте
		const MARKER_COORDINATES = [30.3812526132812, 59.94480848799107];

		// Объект с параметрами центра и зумом карты
		const LOCATION = { center: CENTER_COORDINATES, zoom: 11 };

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

		// Добавление центра карты
		map.addChild(new YMapMarker({ coordinates: CENTER_COORDINATES }));

		// Добавление маркера на карту
		map.addChild(
			new YMapMarker({ coordinates: MARKER_COORDINATES }, imgContainer)
		);
	}
}

// темная тема
const themeSwitch = document.querySelector('.switch > input');
themeSwitch.addEventListener('input', () => {
	if (themeSwitch.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
});

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
