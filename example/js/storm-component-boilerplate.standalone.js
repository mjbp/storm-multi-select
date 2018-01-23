/**
 * @name storm-component-boilerplate: 
 * @version 0.1.0: Tue, 23 Jan 2018 13:25:43 GMT
 * @author stormid
 * @license MIT
 */
(function(root, factory) {
   var mod = {
       exports: {}
   };
   if (typeof exports !== 'undefined'){
       mod.exports = exports
       factory(mod.exports)
       module.exports = mod.exports.default
   } else {
       factory(mod.exports);
       root.gulpWrapUmd = mod.exports.default
   }

}(this, function(exports) {
   'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaults = {
	callback: null
};

var augmentInput = function augmentInput(node) {
	var container = n('div', { class: 'ms__container' }),
	    search = n('input', { class: 'ms__search', autocomplete: 'off', tabindex: 0 }),
	    dropdown = n('div', { class: 'ms__dropdown', tabindex: '-1', hidden: 'hidden' }),
	    placeholder = !node.children[0].getAttribute('value') ? n('div', { class: 'ms__placeholder' }, [node.children[0].innerHTML]) : '',
	    options = [].slice.call(node.children).reduce(function (acc, option) {
		if (option.getAttribute('value')) acc.push(n('div', { class: 'ms__item', tabindex: 0, 'data-value': option.getAttribute('value') }, [option.innerHTML]));
		return acc;
	}, []);

	placeholder && container.appendChild(placeholder);
	container.appendChild(search);
	container.appendChild(options.reduce(function (dropdown, option) {
		dropdown.appendChild(option);
		return dropdown;
	}, dropdown));

	node.classList.add('is--hidden');
	node.setAttribute('hidden', 'hidden');
	node.parentNode.replaceChild(container, node);
	container.insertBefore(node, container.firstElementChild);

	return {
		container: container,
		search: search,
		dropdown: dropdown,
		options: options,
		placeholder: placeholder,
		originalOptions: [].slice.call(node.children)
	};
};

var extractOptions = function extractOptions(options) {
	return options.map(function (option) {
		return {
			label: option.innerHTML,
			value: option.getAttribute('data-value'),
			node: option,
			selected: false
		};
	});
};

var findOption = function findOption(options, val) {
	return options.filter(function (option) {
		return option.value === val;
	})[0];
};

var findNextFocusableOption = function findNextFocusableOption(node, options) {
	var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'next';

	var found = false;
	while (node && found === false) {
		if (!node.classList.contains('is--hidden')) return found = node;
		node = node[direction + 'ElementSibling'];
	}
	return found;
};

var n = function n(nodeName, attrs, children) {
	var parent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

	var node = document.createElement(nodeName);
	for (var attr in attrs) {
		node.setAttribute(attr, attrs[attr]);
	}node = children ? children.reduce(function (acc, child) {
		if (typeof child === 'string') acc.appendChild(document.createTextNode(child));
		return acc;
	}, node) : node;

	return node;
};

var createPillsArray = function createPillsArray(options) {
	return options.reduce(function (acc, option) {
		if (option.selected) acc.push(n('div', {
			class: 'ms__pill',
			role: 'button',
			'data-value': option.value,
			tabindex: 0
		}, [option.label]));
		return acc;
	}, []);
};

var TRIGGER_EVENTS = ['ontouchstart' in window ? 'touchstart' : 'click', 'keydown'];

var TRIGGER_KEYCODES = [13, 32];

var KEYCODES = {
	ENTER: 13,
	SPACE: 32,
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39,
	ESCAPE: 27,
	TAB: 9
};

/*
    9: 'TAB',
    13: 'ENTER',
    27: 'ESCAPE',
    32: 'SPACE',
    33: 'PAGE_UP',
    34: 'PAGE_DOWN',
    37: 'LEFT',
    38: 'UP',
    39: 'RIGHT',
    40: 'DOWN'
*/

var componentPrototype = {
	init: function init() {
		var _this = this;

		this.isOpen = false;
		this.dom = augmentInput(this.node);

		this.options = extractOptions(this.dom.options);

		this.dom.search.addEventListener('focus', this.handleFocus.bind(this));
		this.dom.search.addEventListener('keyup', this.handlekeyup.bind(this));

		this.dom.options.forEach(function (option) {
			option.addEventListener('click', function (e) {
				e.preventDefault(), e.stopPropagation();
				_this.setOption(findOption(_this.options, e.target.getAttribute('data-value')));
				//this.close();
			});
		});

		TRIGGER_EVENTS.forEach(function (ev) {
			// this.dom.container.addEventListener(ev, e => {
			// 	if(!!e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.keyCode)) return;
			// 	this.isOpen ? this.close() : this.open();
			// });
			_this.dom.container.addEventListener('click', function () {
				_this.isOpen ? _this.close() : _this.open();
			});
		});

		this.boundBlurHandler = this.handleBlur.bind(this);
		this.boundDropdownKeyupHandler = this.handleDropdownKeyup.bind(this);

		// this.domIndexedOptions = this.options.reduce((acc, option) => {
		// 	if(option.value) acc[`${option.label}`] = option;
		// 	return acc;
		// }, {});

		console.log(this);
		return this;
	},
	handlekeyup: function handlekeyup(e) {
		if (e.keyCode === KEYCODES.ENTER) {
			e.preventDefault();
			var matched = findOption(this.options, e.target.value);
			if (!matched) return;
			return this.setOption(matched);
		}
		// if(e.keyCode === KEYCODES.DOWN) { 
		// 	this.open();
		// 	let next = findNextFocusableOption(this.options[0].node, this.options);
		// 	if(next) next.focus();
		// }
		if (!this.isOpen) this.open();
		this.reduceOptionList(e.target.value.trim());
	},
	handleFocus: function handleFocus() {
		this.isOpen ? this.close() : this.open();
	},
	handleBlur: function handleBlur(e) {
		if (!this.dom.container.contains(e.target)) this.close();
	},
	handleDropdownKeyup: function handleDropdownKeyup(e) {
		var _dictionary;

		var dictionary = (_dictionary = {}, _defineProperty(_dictionary, KEYCODES.UP, function () {
			e.preventDefault();
			if (!this.dom.dropdown.contains(document.activeElement) || document.activeElement === this.dom.options[0]) return;
			var next = findNextFocusableOption(document.activeElement.previousElementSibling, this.options, 'previous');

			if (next) next.focus();
		}), _defineProperty(_dictionary, KEYCODES.DOWN, function () {
			e.preventDefault();
			if (document.activeElement === this.dom.options[this.dom.options.length - 1]) return;

			var candidate = !this.dom.dropdown.contains(document.activeElement) ? this.dom.options[0] : document.activeElement.nextElementSibling,
			    next = findNextFocusableOption(candidate, this.options);

			if (next) next.focus();
		}), _defineProperty(_dictionary, KEYCODES.TAB, function () {
			return this.close();
		}), _defineProperty(_dictionary, KEYCODES.ENTER, function () {
			e.preventDefault();
			e.target.nextElementSibling ? e.target.nextElementSibling.focus() : e.target.previousElementSibling ? e.target.previousElementSibling.focus() : this.dom.search.focus();
			this.setOption(findOption(this.options, e.target.getAttribute('data-value')));
		}), _defineProperty(_dictionary, KEYCODES.ESCAPE, function () {
			return this.dom.search.focus();
		}), _dictionary);
		dictionary[e.keyCode] && dictionary[e.keyCode].call(this, e);
	},
	open: function open() {
		this.isOpen = true;
		this.dom.dropdown.removeAttribute('hidden');
		this.dom.dropdown.classList.add('is--open');
		this.dom.placeholder && this.dom.placeholder.setAttribute('hidden', 'hidden');

		document.body.addEventListener('focusin', this.boundBlurHandler);
		document.body.addEventListener('click', this.boundBlurHandler);

		this.dom.container.addEventListener('keydown', this.boundDropdownKeyupHandler);
	},
	close: function close() {
		this.isOpen = false;
		this.dom.dropdown.setAttribute('hidden', 'hidden');
		this.dom.dropdown.classList.remove('is--open');
		this.dom.placeholder && this.dom.placeholder.removeAttribute('hidden');

		document.body.removeEventListener('focusin', this.boundBlurHandler);
		document.body.removeEventListener('click', this.boundBlurHandler);

		this.dom.container.removeEventListener('keydown', this.boundDropdownKeyupHandler);
		//this.dom.search.value = '';
	},
	setOption: function setOption(option) {
		if (option.value === '') return;

		//Can't set value on the node for multiple options
		//Unsless we use an HTMLCollection/nodeList??
		//this.node.value = option;

		option.selected = true;
		this.renderPills();
		this.dom.search.value = '';

		option.node.classList.add('is--hidden');
	},
	removeOption: function removeOption(option) {
		option.selected = false;
		this.renderPills();
		option.node.classList.remove('is--hidden');
	},
	reduceOptionList: function reduceOptionList(str) {
		this.options.forEach(function (option) {
			if ((!!~option.label.indexOf(str) || str === '') && !option.selected) option.node.classList.remove('is--hidden');else option.node.classList.add('is--hidden');
		});
	},
	renderPills: function renderPills() {
		var _this2 = this;

		//rendering all pills... ;_:
		this.pills && this.pills.forEach(function (pill) {
			pill.parentNode.removeChild(pill);
		});

		this.pills = createPillsArray(this.options).map(function (pill) {
			_this2.dom.container.insertBefore(pill, _this2.dom.search);
			TRIGGER_EVENTS.forEach(function (ev) {
				pill.addEventListener(ev, function (e) {
					if (!!e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.keyCode)) return;
					e.preventDefault(), e.stopPropagation();
					_this2.removeOption(findOption(_this2.options, e.target.getAttribute('data-value')));
					_this2.dom.search.focus();
				});
			});
			return pill;
		});

		if (this.pills.length) this.dom.placeholder.classList.add('is--hidden');else this.dom.placeholder.classList.remove('is--hidden');
	},
	getValue: function getValue() {
		return this.options.filter(function (option) {
			return option.selected;
		});
	}
};

var init = function init(sel, opts) {
	var els = [].slice.call(document.querySelectorAll(sel));
	//let els = Array.from(document.querySelectorAll(sel));

	if (!els.length) return console.warn('Multi-select not initialised, no augmentable elements found');

	return els.map(function (el) {
		return _defineProperty({}, el.getAttribute('name'), Object.assign(Object.create(componentPrototype), {
			node: el,
			settings: Object.assign({}, defaults, opts)
		}).init());
	});
};

var index = { init: init };

exports.default = index;;
}));
