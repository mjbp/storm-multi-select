import { augmentInput, extractOptions, createPillsArray, findOption, findNextFocusableOption } from './utils';
import { TRIGGER_EVENTS, TRIGGER_KEYCODES, KEYCODES } from './constants';

export default {
	init() {
		this.isOpen = false;
		this.dom = augmentInput(this.node);

		this.options = extractOptions(this.dom.options);

		this.dom.search.addEventListener('focus',this.handleFocus.bind(this));
		this.dom.search.addEventListener('keyup',this.handlekeyup.bind(this));

		this.dom.options.forEach(option => {
			option.addEventListener('click', e => {
				e.preventDefault(), e.stopPropagation();
				this.setOption(findOption(this.options, e.target.getAttribute('data-value')));
				//this.close();
			});
		});

		TRIGGER_EVENTS.forEach(ev => {
			// this.dom.container.addEventListener(ev, e => {
			// 	if(!!e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.keyCode)) return;
			// 	this.isOpen ? this.close() : this.open();
			// });
			this.dom.container.addEventListener('click', () => { this.isOpen ? this.close() : this.open(); });
		});

		this.boundBlurHandler = this.handleBlur.bind(this);
		this.boundDropdownKeyupHandler = this.handleDropdownKeyup.bind(this)

		// this.domIndexedOptions = this.options.reduce((acc, option) => {
		// 	if(option.value) acc[`${option.label}`] = option;
		// 	return acc;
		// }, {});

		console.log(this);
		return this;
	},
	handlekeyup(e){
		if(e.keyCode === KEYCODES.ENTER) {
			e.preventDefault();
			let matched = findOption(this.options, e.target.value);
			if(!matched) return;
			return this.setOption(matched);
		}
		// if(e.keyCode === KEYCODES.DOWN) { 
		// 	this.open();
		// 	let next = findNextFocusableOption(this.options[0].node, this.options);
		// 	if(next) next.focus();
		// }
		if(!this.isOpen) this.open();
		this.reduceOptionList(e.target.value.trim());
	},
	handleFocus(){ 
		this.isOpen ? this.close() : this.open();
	},
	handleBlur(e){
		if(!this.dom.container.contains(e.target)) this.close();
	},
	handleDropdownKeyup(e){
		let dictionary = {
				[KEYCODES.UP](){
					e.preventDefault();
					if(!this.dom.dropdown.contains(document.activeElement) || document.activeElement === this.dom.options[0]) return;
					let next = findNextFocusableOption(document.activeElement.previousElementSibling, this.options, 'previous');

					if(next) next.focus();
				},
				[KEYCODES.DOWN](){
					e.preventDefault();
					if(document.activeElement === this.dom.options[this.dom.options.length - 1]) return;

					let candidate = !this.dom.dropdown.contains(document.activeElement) ? this.dom.options[0] : document.activeElement.nextElementSibling,
						next = findNextFocusableOption(candidate, this.options);

					if(next) next.focus();
				},
				[KEYCODES.TAB](){ return this.close(); },
				[KEYCODES.ENTER](){
					e.preventDefault();
					e.target.nextElementSibling ? e.target.nextElementSibling.focus() : e.target.previousElementSibling ? e.target.previousElementSibling.focus() : this.dom.search.focus();
					this.setOption(findOption(this.options, e.target.getAttribute('data-value')));
				},
				[KEYCODES.ESCAPE](){ return this.dom.search.focus(); }
			};
		dictionary[e.keyCode] && dictionary[e.keyCode].call(this, e);
	},
	open(){
		this.isOpen = true;
		this.dom.dropdown.removeAttribute('hidden');
		this.dom.dropdown.classList.add('is--open');
		this.dom.placeholder && this.dom.placeholder.setAttribute('hidden', 'hidden');

		document.body.addEventListener('focusin', this.boundBlurHandler);
		document.body.addEventListener('click', this.boundBlurHandler);

		this.dom.container.addEventListener('keydown', this.boundDropdownKeyupHandler);
	},
	close(){
		this.isOpen = false;
		this.dom.dropdown.setAttribute('hidden', 'hidden');
		this.dom.dropdown.classList.remove('is--open');
		this.dom.placeholder && this.dom.placeholder.removeAttribute('hidden');

		document.body.removeEventListener('focusin', this.boundBlurHandler);
		document.body.removeEventListener('click', this.boundBlurHandler);

		this.dom.container.removeEventListener('keydown', this.boundDropdownKeyupHandler);
		//this.dom.search.value = '';
	},
	setOption(option){
		if(option.value === '') return;
		
		//Can't set value on the node for multiple options
		//Unsless we use an HTMLCollection/nodeList??
		//this.node.value = option;

		option.selected = true;
		this.renderPills();
		this.dom.search.value = '';

		option.node.classList.add('is--hidden');
	},
	removeOption(option){
		option.selected = false;
		this.renderPills();
		option.node.classList.remove('is--hidden');
	},
	reduceOptionList(str){
		this.options.forEach(option => {
			if((!!~option.label.indexOf(str) || str === '') && !option.selected) option.node.classList.remove('is--hidden');
			else option.node.classList.add('is--hidden');
		});
	},
	renderPills(){
		//rendering all pills... ;_:
		this.pills && this.pills.forEach(pill => { pill.parentNode.removeChild(pill)});
		
		this.pills = createPillsArray(this.options).map(pill => {
			this.dom.container.insertBefore(pill, this.dom.search);
			TRIGGER_EVENTS.forEach(ev => {
				pill.addEventListener(ev, e => {
					if(!!e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.keyCode)) return;
					e.preventDefault(), e.stopPropagation();
					this.removeOption(findOption(this.options, e.target.getAttribute('data-value')));
					this.dom.search.focus();
				});
			});
			return pill;
		});

		if(this.pills.length) this.dom.placeholder.classList.add('is--hidden');
		else this.dom.placeholder.classList.remove('is--hidden');
	},
	getValue() { return this.options.filter(option => option.selected); }
};