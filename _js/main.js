import { tns } from '../node_modules/tiny-slider/src/tiny-slider.module'

document.addEventListener('DOMContentLoaded', () => {
	if (window.location.pathname === '/') {
		const slider = tns({
    	container: '.js-slider-singles',
			items: 1,
    	nav: false,
    	autoplayButtonOutput: false,
    	controlsText: [`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
			</svg>`, `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
			</svg>`],
      lazyload: true,
    });
	} else if (window.location.pathname === '/portfolio.html') {
		const slider = tns({
    	container: '.js-slider-triples',
			items: 1,
    	nav: false,
    	autoplayButtonOutput: false,
    	controlsText: [`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
			</svg>`, `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
			</svg>`],
      lazyload: true,
			gutter: 8,
			responsive: {
				592: {
					fixedWidth: 592,
				},
			},
    });
	}
})
