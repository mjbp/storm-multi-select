/**
 * @name storm-multi-select: 
 * @version 0.1.0: Tue, 23 Jan 2018 13:39:12 GMT
 * @author stormid
 * @license MIT
 */
import defaults from './lib/defaults';
import componentPrototype from './lib/component-prototype';

const init = (sel, opts) => {
	let els = [].slice.call(document.querySelectorAll(sel));
    //let els = Array.from(document.querySelectorAll(sel));

	if(!els.length) return console.warn('Multi-select not initialised, no augmentable elements found');
    
	return els.map(el => Object.assign(Object.create(componentPrototype), {
										node: el,
										settings: Object.assign({}, defaults, opts)
									}).init());
};

export default { init };