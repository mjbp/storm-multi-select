(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _component = require('./libs/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {
    _component2.default.init('.js-multi-select');

    // document.querySelector('.js-form').addEventListener('submit', e => {});

    // document.querySelector('.js-form').addEventListener('submit', e => {
    //     e.preventDefault();
    //     console.log(Array.from(e.target.select.selectedOptions).reduce((acc, curr) => {
    //         acc.push(curr.value);
    //         return acc;
    //     }, []));
    // });
}];

if ('addEventListener' in window) window.addEventListener('DOMContentLoaded', function () {
    onDOMContentLoadedTasks.forEach(function (fn) {
        return fn();
    });
});

},{"./libs/component":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defaults = require('./lib/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _componentPrototype = require('./lib/component-prototype');

var _componentPrototype2 = _interopRequireDefault(_componentPrototype);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _defineProperty(obj, key, value) {
	if (key in obj) {
		Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
	} else {
		obj[key] = value;
	}return obj;
}

var init = function init(sel, opts) {
	var els = [].slice.call(document.querySelectorAll(sel));
	//let els = Array.from(document.querySelectorAll(sel));

	if (!els.length) return console.warn('Multi-select not initialised, no augmentable elements found');

	return els.map(function (el) {
		return _defineProperty({}, el.getAttribute('name'), Object.assign(Object.create(_componentPrototype2.default), {
			node: el,
			settings: Object.assign({}, _defaults2.default, opts)
		}).init());
	});
};

exports.default = { init: init };

},{"./lib/component-prototype":3,"./lib/defaults":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _utils = require('./utils');

var _constants = require('./constants');

function _defineProperty(obj, key, value) {
	if (key in obj) {
		Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
	} else {
		obj[key] = value;
	}return obj;
}

exports.default = {
	init: function init() {
		var _this = this;

		this.isOpen = false;
		this.dom = (0, _utils.augmentInput)(this.node);

		this.options = (0, _utils.extractOptions)(this.dom.options);

		this.dom.search.addEventListener('focus', this.handleFocus.bind(this));
		this.dom.search.addEventListener('keyup', this.handlekeyup.bind(this));

		this.dom.options.forEach(function (option) {
			option.addEventListener('click', function (e) {
				e.preventDefault(), e.stopPropagation();
				_this.setOption((0, _utils.findOption)(_this.options, e.target.getAttribute('data-value')));
				//this.close();
			});
		});

		_constants.TRIGGER_EVENTS.forEach(function (ev) {
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
		if (e.keyCode === _constants.KEYCODES.ENTER) {
			e.preventDefault();
			var matched = (0, _utils.findOption)(this.options, e.target.value);
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

		var dictionary = (_dictionary = {}, _defineProperty(_dictionary, _constants.KEYCODES.UP, function () {
			e.preventDefault();
			if (!this.dom.dropdown.contains(document.activeElement) || document.activeElement === this.dom.options[0]) return;
			var next = (0, _utils.findNextFocusableOption)(document.activeElement.previousElementSibling, this.options, 'previous');

			if (next) next.focus();
		}), _defineProperty(_dictionary, _constants.KEYCODES.DOWN, function () {
			e.preventDefault();
			if (document.activeElement === this.dom.options[this.dom.options.length - 1]) return;

			var candidate = !this.dom.dropdown.contains(document.activeElement) ? this.dom.options[0] : document.activeElement.nextElementSibling,
			    next = (0, _utils.findNextFocusableOption)(candidate, this.options);

			if (next) next.focus();
		}), _defineProperty(_dictionary, _constants.KEYCODES.TAB, function () {
			return this.close();
		}), _defineProperty(_dictionary, _constants.KEYCODES.ENTER, function () {
			e.preventDefault();
			e.target.nextElementSibling ? e.target.nextElementSibling.focus() : e.target.previousElementSibling ? e.target.previousElementSibling.focus() : this.dom.search.focus();
			this.setOption((0, _utils.findOption)(this.options, e.target.getAttribute('data-value')));
		}), _defineProperty(_dictionary, _constants.KEYCODES.ESCAPE, function () {
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

		this.pills = (0, _utils.createPillsArray)(this.options).map(function (pill) {
			_this2.dom.container.insertBefore(pill, _this2.dom.search);
			_constants.TRIGGER_EVENTS.forEach(function (ev) {
				pill.addEventListener(ev, function (e) {
					if (!!e.keyCode && !~_constants.TRIGGER_KEYCODES.indexOf(e.keyCode)) return;
					e.preventDefault(), e.stopPropagation();
					_this2.removeOption((0, _utils.findOption)(_this2.options, e.target.getAttribute('data-value')));
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

},{"./constants":4,"./utils":6}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var CLASSNAMES = exports.CLASSNAMES = {};

var TRIGGER_EVENTS = exports.TRIGGER_EVENTS = ['ontouchstart' in window ? 'touchstart' : 'click', 'keydown'];

var TRIGGER_KEYCODES = exports.TRIGGER_KEYCODES = [13, 32];

var KEYCODES = exports.KEYCODES = {
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

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	callback: null
};

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var augmentInput = exports.augmentInput = function augmentInput(node) {
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

var extractOptions = exports.extractOptions = function extractOptions(options) {
    return options.map(function (option) {
        return {
            label: option.innerHTML,
            value: option.getAttribute('data-value'),
            node: option,
            selected: false
        };
    });
};

var findOption = exports.findOption = function findOption(options, val) {
    return options.filter(function (option) {
        return option.value === val;
    })[0];
};

var findNextFocusableOption = exports.findNextFocusableOption = function findNextFocusableOption(node, options) {
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

var createPillsArray = exports.createPillsArray = function createPillsArray(options) {
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7Ozs7O0FBRUEsSUFBTSwyQkFBMkIsWUFBTSxBQUNuQzt3QkFBQSxBQUFZLEtBQVosQUFBaUIsQUFFakI7O0FBRUE7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFaRCxBQUFnQyxDQUFBOztBQWNoQyxJQUFHLHNCQUFILEFBQXlCLGVBQVEsQUFBTyxpQkFBUCxBQUF3QixvQkFBb0IsWUFBTSxBQUFFOzRCQUFBLEFBQXdCLFFBQVEsVUFBQSxBQUFDLElBQUQ7ZUFBQSxBQUFRO0FBQXhDLEFBQWdEO0FBQXBHLENBQUE7Ozs7Ozs7OztBQ2hCakM7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU0sT0FBTyxTQUFQLEFBQU8sS0FBQSxBQUFDLEtBQUQsQUFBTSxNQUFTLEFBQzNCO0tBQUksTUFBTSxHQUFBLEFBQUcsTUFBSCxBQUFTLEtBQUssU0FBQSxBQUFTLGlCQUFqQyxBQUFVLEFBQWMsQUFBMEIsQUFDL0M7QUFFSDs7S0FBRyxDQUFDLElBQUosQUFBUSxRQUFRLE9BQU8sUUFBQSxBQUFRLEtBQWYsQUFBTyxBQUFhLEFBRXBDOztZQUFPLEFBQUksSUFBSSxjQUFBOzZCQUNiLEdBQUEsQUFBRyxhQURVLEFBQ2IsQUFBZ0IsZ0JBQVUsQUFBTyxPQUFP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QUFNLDhDQUFtQixTQUFuQixBQUFtQiwwQkFBQTttQkFBVyxBQUFRLE9BQU8sVUFBQSxBQUFDLEtBQUQsQUFBTSxRQUFXLEFBQ3ZFO1lBQUcsT0FBSCxBQUFVLGNBQVUsQUFBSSxPQUFLLEFBQUU7bUJBQU8sQUFDUCxBQUNQO2tCQUZjLEFBRVIsQUFDTjswQkFBYyxPQUhBLEFBR08sQUFDckI7c0JBSkssQUFBUyxBQUlKO0FBSkksQUFDZCxTQURLLEVBS04sQ0FBQyxPQUxKLEFBQVMsQUFLTixBQUFRLEFBQy9CLE9BTm9CO2VBTXBCLEFBQU8sQUFDVjtBQVIwQyxLQUFBLEVBQVgsQUFBVyxBQVF4QztBQVJJIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBNdWx0aVNlbGVjdCBmcm9tICcuL2xpYnMvY29tcG9uZW50JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuICAgIE11bHRpU2VsZWN0LmluaXQoJy5qcy1tdWx0aS1zZWxlY3QnKTtcblxuICAgIC8vIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1mb3JtJykuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZSA9PiB7fSk7XG5cbiAgICAvLyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtZm9ybScpLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGUgPT4ge1xuICAgIC8vICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKEFycmF5LmZyb20oZS50YXJnZXQuc2VsZWN0LnNlbGVjdGVkT3B0aW9ucykucmVkdWNlKChhY2MsIGN1cnIpID0+IHtcbiAgICAvLyAgICAgICAgIGFjYy5wdXNoKGN1cnIudmFsdWUpO1xuICAgIC8vICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAvLyAgICAgfSwgW10pKTtcbiAgICAvLyB9KTtcbn1dO1xuICAgIFxuaWYoJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdykgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSk7IiwiaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vbGliL2RlZmF1bHRzJztcbmltcG9ydCBjb21wb25lbnRQcm90b3R5cGUgZnJvbSAnLi9saWIvY29tcG9uZW50LXByb3RvdHlwZSc7XG5cbmNvbnN0IGluaXQgPSAoc2VsLCBvcHRzKSA9PiB7XG5cdGxldCBlbHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKSk7XG4gICAgLy9sZXQgZWxzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuXG5cdGlmKCFlbHMubGVuZ3RoKSByZXR1cm4gY29uc29sZS53YXJuKCdNdWx0aS1zZWxlY3Qgbm90IGluaXRpYWxpc2VkLCBubyBhdWdtZW50YWJsZSBlbGVtZW50cyBmb3VuZCcpO1xuICAgIFxuXHRyZXR1cm4gZWxzLm1hcChlbCA9PiAoe1xuXHRcdFtlbC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV06IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShjb21wb25lbnRQcm90b3R5cGUpLCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5vZGU6IGVsLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzZXR0aW5nczogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpXG5cdFx0XHRcdFx0XHRcdFx0XHR9KS5pbml0KClcblx0fSkpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07IiwiaW1wb3J0IHsgYXVnbWVudElucHV0LCBleHRyYWN0T3B0aW9ucywgY3JlYXRlUGlsbHNBcnJheSwgZmluZE9wdGlvbiwgZmluZE5leHRGb2N1c2FibGVPcHRpb24gfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IFRSSUdHRVJfRVZFTlRTLCBUUklHR0VSX0tFWUNPREVTLCBLRVlDT0RFUyB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRpbml0KCkge1xuXHRcdHRoaXMuaXNPcGVuID0gZmFsc2U7XG5cdFx0dGhpcy5kb20gPSBhdWdtZW50SW5wdXQodGhpcy5ub2RlKTtcblxuXHRcdHRoaXMub3B0aW9ucyA9IGV4dHJhY3RPcHRpb25zKHRoaXMuZG9tLm9wdGlvbnMpO1xuXG5cdFx0dGhpcy5kb20uc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJyx0aGlzLmhhbmRsZUZvY3VzLmJpbmQodGhpcykpO1xuXHRcdHRoaXMuZG9tLnNlYXJjaC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsdGhpcy5oYW5kbGVrZXl1cC5iaW5kKHRoaXMpKTtcblxuXHRcdHRoaXMuZG9tLm9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4ge1xuXHRcdFx0b3B0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKSwgZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0dGhpcy5zZXRPcHRpb24oZmluZE9wdGlvbih0aGlzLm9wdGlvbnMsIGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWx1ZScpKSk7XG5cdFx0XHRcdC8vdGhpcy5jbG9zZSgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHRUUklHR0VSX0VWRU5UUy5mb3JFYWNoKGV2ID0+IHtcblx0XHRcdC8vIHRoaXMuZG9tLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKGV2LCBlID0+IHtcblx0XHRcdC8vIFx0aWYoISFlLmtleUNvZGUgJiYgIX5UUklHR0VSX0tFWUNPREVTLmluZGV4T2YoZS5rZXlDb2RlKSkgcmV0dXJuO1xuXHRcdFx0Ly8gXHR0aGlzLmlzT3BlbiA/IHRoaXMuY2xvc2UoKSA6IHRoaXMub3BlbigpO1xuXHRcdFx0Ly8gfSk7XG5cdFx0XHR0aGlzLmRvbS5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7IHRoaXMuaXNPcGVuID8gdGhpcy5jbG9zZSgpIDogdGhpcy5vcGVuKCk7IH0pO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5ib3VuZEJsdXJIYW5kbGVyID0gdGhpcy5oYW5kbGVCbHVyLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5ib3VuZERyb3Bkb3duS2V5dXBIYW5kbGVyID0gdGhpcy5oYW5kbGVEcm9wZG93bktleXVwLmJpbmQodGhpcylcblxuXHRcdC8vIHRoaXMuZG9tSW5kZXhlZE9wdGlvbnMgPSB0aGlzLm9wdGlvbnMucmVkdWNlKChhY2MsIG9wdGlvbikgPT4ge1xuXHRcdC8vIFx0aWYob3B0aW9uLnZhbHVlKSBhY2NbYCR7b3B0aW9uLmxhYmVsfWBdID0gb3B0aW9uO1xuXHRcdC8vIFx0cmV0dXJuIGFjYztcblx0XHQvLyB9LCB7fSk7XG5cblx0XHRjb25zb2xlLmxvZyh0aGlzKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0aGFuZGxla2V5dXAoZSl7XG5cdFx0aWYoZS5rZXlDb2RlID09PSBLRVlDT0RFUy5FTlRFUikge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IG1hdGNoZWQgPSBmaW5kT3B0aW9uKHRoaXMub3B0aW9ucywgZS50YXJnZXQudmFsdWUpO1xuXHRcdFx0aWYoIW1hdGNoZWQpIHJldHVybjtcblx0XHRcdHJldHVybiB0aGlzLnNldE9wdGlvbihtYXRjaGVkKTtcblx0XHR9XG5cdFx0Ly8gaWYoZS5rZXlDb2RlID09PSBLRVlDT0RFUy5ET1dOKSB7IFxuXHRcdC8vIFx0dGhpcy5vcGVuKCk7XG5cdFx0Ly8gXHRsZXQgbmV4dCA9IGZpbmROZXh0Rm9jdXNhYmxlT3B0aW9uKHRoaXMub3B0aW9uc1swXS5ub2RlLCB0aGlzLm9wdGlvbnMpO1xuXHRcdC8vIFx0aWYobmV4dCkgbmV4dC5mb2N1cygpO1xuXHRcdC8vIH1cblx0XHRpZighdGhpcy5pc09wZW4pIHRoaXMub3BlbigpO1xuXHRcdHRoaXMucmVkdWNlT3B0aW9uTGlzdChlLnRhcmdldC52YWx1ZS50cmltKCkpO1xuXHR9LFxuXHRoYW5kbGVGb2N1cygpeyBcblx0XHR0aGlzLmlzT3BlbiA/IHRoaXMuY2xvc2UoKSA6IHRoaXMub3BlbigpO1xuXHR9LFxuXHRoYW5kbGVCbHVyKGUpe1xuXHRcdGlmKCF0aGlzLmRvbS5jb250YWluZXIuY29udGFpbnMoZS50YXJnZXQpKSB0aGlzLmNsb3NlKCk7XG5cdH0sXG5cdGhhbmRsZURyb3Bkb3duS2V5dXAoZSl7XG5cdFx0bGV0IGRpY3Rpb25hcnkgPSB7XG5cdFx0XHRcdFtLRVlDT0RFUy5VUF0oKXtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0aWYoIXRoaXMuZG9tLmRyb3Bkb3duLmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHx8IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRoaXMuZG9tLm9wdGlvbnNbMF0pIHJldHVybjtcblx0XHRcdFx0XHRsZXQgbmV4dCA9IGZpbmROZXh0Rm9jdXNhYmxlT3B0aW9uKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQucHJldmlvdXNFbGVtZW50U2libGluZywgdGhpcy5vcHRpb25zLCAncHJldmlvdXMnKTtcblxuXHRcdFx0XHRcdGlmKG5leHQpIG5leHQuZm9jdXMoKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0W0tFWUNPREVTLkRPV05dKCl7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGlmKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRoaXMuZG9tLm9wdGlvbnNbdGhpcy5kb20ub3B0aW9ucy5sZW5ndGggLSAxXSkgcmV0dXJuO1xuXG5cdFx0XHRcdFx0bGV0IGNhbmRpZGF0ZSA9ICF0aGlzLmRvbS5kcm9wZG93bi5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSA/IHRoaXMuZG9tLm9wdGlvbnNbMF0gOiBkb2N1bWVudC5hY3RpdmVFbGVtZW50Lm5leHRFbGVtZW50U2libGluZyxcblx0XHRcdFx0XHRcdG5leHQgPSBmaW5kTmV4dEZvY3VzYWJsZU9wdGlvbihjYW5kaWRhdGUsIHRoaXMub3B0aW9ucyk7XG5cblx0XHRcdFx0XHRpZihuZXh0KSBuZXh0LmZvY3VzKCk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdFtLRVlDT0RFUy5UQUJdKCl7IHJldHVybiB0aGlzLmNsb3NlKCk7IH0sXG5cdFx0XHRcdFtLRVlDT0RFUy5FTlRFUl0oKXtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0ZS50YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nID8gZS50YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nLmZvY3VzKCkgOiBlLnRhcmdldC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nID8gZS50YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZy5mb2N1cygpIDogdGhpcy5kb20uc2VhcmNoLmZvY3VzKCk7XG5cdFx0XHRcdFx0dGhpcy5zZXRPcHRpb24oZmluZE9wdGlvbih0aGlzLm9wdGlvbnMsIGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWx1ZScpKSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdFtLRVlDT0RFUy5FU0NBUEVdKCl7IHJldHVybiB0aGlzLmRvbS5zZWFyY2guZm9jdXMoKTsgfVxuXHRcdFx0fTtcblx0XHRkaWN0aW9uYXJ5W2Uua2V5Q29kZV0gJiYgZGljdGlvbmFyeVtlLmtleUNvZGVdLmNhbGwodGhpcywgZSk7XG5cdH0sXG5cdG9wZW4oKXtcblx0XHR0aGlzLmlzT3BlbiA9IHRydWU7XG5cdFx0dGhpcy5kb20uZHJvcGRvd24ucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcblx0XHR0aGlzLmRvbS5kcm9wZG93bi5jbGFzc0xpc3QuYWRkKCdpcy0tb3BlbicpO1xuXHRcdHRoaXMuZG9tLnBsYWNlaG9sZGVyICYmIHRoaXMuZG9tLnBsYWNlaG9sZGVyLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJ2hpZGRlbicpO1xuXG5cdFx0ZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdmb2N1c2luJywgdGhpcy5ib3VuZEJsdXJIYW5kbGVyKTtcblx0XHRkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5ib3VuZEJsdXJIYW5kbGVyKTtcblxuXHRcdHRoaXMuZG9tLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5ib3VuZERyb3Bkb3duS2V5dXBIYW5kbGVyKTtcblx0fSxcblx0Y2xvc2UoKXtcblx0XHR0aGlzLmlzT3BlbiA9IGZhbHNlO1xuXHRcdHRoaXMuZG9tLmRyb3Bkb3duLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJ2hpZGRlbicpO1xuXHRcdHRoaXMuZG9tLmRyb3Bkb3duLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLS1vcGVuJyk7XG5cdFx0dGhpcy5kb20ucGxhY2Vob2xkZXIgJiYgdGhpcy5kb20ucGxhY2Vob2xkZXIucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcblxuXHRcdGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIHRoaXMuYm91bmRCbHVySGFuZGxlcik7XG5cdFx0ZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYm91bmRCbHVySGFuZGxlcik7XG5cblx0XHR0aGlzLmRvbS5jb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuYm91bmREcm9wZG93bktleXVwSGFuZGxlcik7XG5cdFx0Ly90aGlzLmRvbS5zZWFyY2gudmFsdWUgPSAnJztcblx0fSxcblx0c2V0T3B0aW9uKG9wdGlvbil7XG5cdFx0aWYob3B0aW9uLnZhbHVlID09PSAnJykgcmV0dXJuO1xuXHRcdFxuXHRcdC8vQ2FuJ3Qgc2V0IHZhbHVlIG9uIHRoZSBub2RlIGZvciBtdWx0aXBsZSBvcHRpb25zXG5cdFx0Ly9VbnNsZXNzIHdlIHVzZSBhbiBIVE1MQ29sbGVjdGlvbi9ub2RlTGlzdD8/XG5cdFx0Ly90aGlzLm5vZGUudmFsdWUgPSBvcHRpb247XG5cblx0XHRvcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdHRoaXMucmVuZGVyUGlsbHMoKTtcblx0XHR0aGlzLmRvbS5zZWFyY2gudmFsdWUgPSAnJztcblxuXHRcdG9wdGlvbi5ub2RlLmNsYXNzTGlzdC5hZGQoJ2lzLS1oaWRkZW4nKTtcblx0fSxcblx0cmVtb3ZlT3B0aW9uKG9wdGlvbil7XG5cdFx0b3B0aW9uLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0dGhpcy5yZW5kZXJQaWxscygpO1xuXHRcdG9wdGlvbi5ub2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLS1oaWRkZW4nKTtcblx0fSxcblx0cmVkdWNlT3B0aW9uTGlzdChzdHIpe1xuXHRcdHRoaXMub3B0aW9ucy5mb3JFYWNoKG9wdGlvbiA9PiB7XG5cdFx0XHRpZigoISF+b3B0aW9uLmxhYmVsLmluZGV4T2Yoc3RyKSB8fCBzdHIgPT09ICcnKSAmJiAhb3B0aW9uLnNlbGVjdGVkKSBvcHRpb24ubm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdpcy0taGlkZGVuJyk7XG5cdFx0XHRlbHNlIG9wdGlvbi5ub2RlLmNsYXNzTGlzdC5hZGQoJ2lzLS1oaWRkZW4nKTtcblx0XHR9KTtcblx0fSxcblx0cmVuZGVyUGlsbHMoKXtcblx0XHQvL3JlbmRlcmluZyBhbGwgcGlsbHMuLi4gO186XG5cdFx0dGhpcy5waWxscyAmJiB0aGlzLnBpbGxzLmZvckVhY2gocGlsbCA9PiB7IHBpbGwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwaWxsKX0pO1xuXHRcdFxuXHRcdHRoaXMucGlsbHMgPSBjcmVhdGVQaWxsc0FycmF5KHRoaXMub3B0aW9ucykubWFwKHBpbGwgPT4ge1xuXHRcdFx0dGhpcy5kb20uY29udGFpbmVyLmluc2VydEJlZm9yZShwaWxsLCB0aGlzLmRvbS5zZWFyY2gpO1xuXHRcdFx0VFJJR0dFUl9FVkVOVFMuZm9yRWFjaChldiA9PiB7XG5cdFx0XHRcdHBpbGwuYWRkRXZlbnRMaXN0ZW5lcihldiwgZSA9PiB7XG5cdFx0XHRcdFx0aWYoISFlLmtleUNvZGUgJiYgIX5UUklHR0VSX0tFWUNPREVTLmluZGV4T2YoZS5rZXlDb2RlKSkgcmV0dXJuO1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKSwgZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHR0aGlzLnJlbW92ZU9wdGlvbihmaW5kT3B0aW9uKHRoaXMub3B0aW9ucywgZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXZhbHVlJykpKTtcblx0XHRcdFx0XHR0aGlzLmRvbS5zZWFyY2guZm9jdXMoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBwaWxsO1xuXHRcdH0pO1xuXG5cdFx0aWYodGhpcy5waWxscy5sZW5ndGgpIHRoaXMuZG9tLnBsYWNlaG9sZGVyLmNsYXNzTGlzdC5hZGQoJ2lzLS1oaWRkZW4nKTtcblx0XHRlbHNlIHRoaXMuZG9tLnBsYWNlaG9sZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLS1oaWRkZW4nKTtcblx0fSxcblx0Z2V0VmFsdWUoKSB7IHJldHVybiB0aGlzLm9wdGlvbnMuZmlsdGVyKG9wdGlvbiA9PiBvcHRpb24uc2VsZWN0ZWQpOyB9XG59OyIsImV4cG9ydCBjb25zdCBDTEFTU05BTUVTID0ge1xufTtcblxuZXhwb3J0IGNvbnN0IFRSSUdHRVJfRVZFTlRTID0gWydvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyA/ICd0b3VjaHN0YXJ0JyA6ICdjbGljaycsICdrZXlkb3duJyBdO1xuXG5leHBvcnQgY29uc3QgVFJJR0dFUl9LRVlDT0RFUyA9IFsxMywgMzJdXG5cbmV4cG9ydCBjb25zdCBLRVlDT0RFUyA9IHtcbiAgICBFTlRFUjogMTMsXG4gICAgU1BBQ0U6IDMyLFxuICAgIFVQOiAzOCxcbiAgICBET1dOOiA0MCxcbiAgICBMRUZUOiAzNyxcbiAgICBSSUdIVDogMzksXG4gICAgRVNDQVBFOiAyNyxcbiAgICBUQUI6IDlcbn07XG5cblxuLypcbiAgICA5OiAnVEFCJyxcbiAgICAxMzogJ0VOVEVSJyxcbiAgICAyNzogJ0VTQ0FQRScsXG4gICAgMzI6ICdTUEFDRScsXG4gICAgMzM6ICdQQUdFX1VQJyxcbiAgICAzNDogJ1BBR0VfRE9XTicsXG4gICAgMzc6ICdMRUZUJyxcbiAgICAzODogJ1VQJyxcbiAgICAzOTogJ1JJR0hUJyxcbiAgICA0MDogJ0RPV04nXG4qLyIsImV4cG9ydCBkZWZhdWx0IHtcblx0Y2FsbGJhY2s6IG51bGxcbn07IiwiZXhwb3J0IGNvbnN0IGF1Z21lbnRJbnB1dCA9IG5vZGUgPT4ge1xuICAgIGxldCBjb250YWluZXIgPSBuKCdkaXYnLCB7IGNsYXNzOiAnbXNfX2NvbnRhaW5lcid9KSxcbiAgICAgICAgc2VhcmNoID0gbignaW5wdXQnLCB7IGNsYXNzOiAnbXNfX3NlYXJjaCcsIGF1dG9jb21wbGV0ZTogJ29mZicsIHRhYmluZGV4OiAwIH0pLFxuICAgICAgICBkcm9wZG93biA9IG4oJ2RpdicsIHsgY2xhc3M6ICdtc19fZHJvcGRvd24nLCB0YWJpbmRleDogJy0xJywgaGlkZGVuOiAnaGlkZGVuJ30pLFxuICAgICAgICBwbGFjZWhvbGRlciA9ICFub2RlLmNoaWxkcmVuWzBdLmdldEF0dHJpYnV0ZSgndmFsdWUnKSA/IG4oJ2RpdicsIHsgY2xhc3M6ICdtc19fcGxhY2Vob2xkZXInIH0sIFtub2RlLmNoaWxkcmVuWzBdLmlubmVySFRNTF0pIDogJycsXG4gICAgICAgIG9wdGlvbnMgPSBbXS5zbGljZS5jYWxsKG5vZGUuY2hpbGRyZW4pXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhY2MsIG9wdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKG9wdGlvbi5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykpIGFjYy5wdXNoKG4oJ2RpdicsIHsgY2xhc3M6IGBtc19faXRlbWAsIHRhYmluZGV4OiAwLCdkYXRhLXZhbHVlJzogb3B0aW9uLmdldEF0dHJpYnV0ZSgndmFsdWUnKX0sIFtvcHRpb24uaW5uZXJIVE1MXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBbXSk7XG5cbiAgICBwbGFjZWhvbGRlciAmJiBjb250YWluZXIuYXBwZW5kQ2hpbGQocGxhY2Vob2xkZXIpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWFyY2gpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChvcHRpb25zLnJlZHVjZSgoZHJvcGRvd24sIG9wdGlvbikgPT4ge1xuICAgICAgICBkcm9wZG93bi5hcHBlbmRDaGlsZChvcHRpb24pO1xuICAgICAgICByZXR1cm4gZHJvcGRvd247XG4gICAgfSwgZHJvcGRvd24pKTtcblxuICAgIG5vZGUuY2xhc3NMaXN0LmFkZCgnaXMtLWhpZGRlbicpO1xuICAgIG5vZGUuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnaGlkZGVuJyk7XG4gICAgbm9kZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChjb250YWluZXIsIG5vZGUpO1xuICAgIGNvbnRhaW5lci5pbnNlcnRCZWZvcmUobm9kZSwgY29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgc2VhcmNoLFxuICAgICAgICBkcm9wZG93bixcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgcGxhY2Vob2xkZXIsXG4gICAgICAgIG9yaWdpbmFsT3B0aW9uczogW10uc2xpY2UuY2FsbChub2RlLmNoaWxkcmVuKVxuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0T3B0aW9ucyA9IG9wdGlvbnMgPT4gb3B0aW9ucy5tYXAob3B0aW9uID0+ICh7XG4gICAgbGFiZWw6IG9wdGlvbi5pbm5lckhUTUwsXG4gICAgdmFsdWU6IG9wdGlvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsdWUnKSxcbiAgICBub2RlOiBvcHRpb24sXG4gICAgc2VsZWN0ZWQ6IGZhbHNlXG59KSk7XG5cbmV4cG9ydCBjb25zdCBmaW5kT3B0aW9uID0gKG9wdGlvbnMsIHZhbCkgPT4gb3B0aW9ucy5maWx0ZXIob3B0aW9uID0+IG9wdGlvbi52YWx1ZSA9PT0gdmFsKVswXTtcblxuZXhwb3J0IGNvbnN0IGZpbmROZXh0Rm9jdXNhYmxlT3B0aW9uID0gKG5vZGUsIG9wdGlvbnMsIGRpcmVjdGlvbiA9ICduZXh0JykgPT4ge1xuICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgIHdoaWxlKG5vZGUgJiYgZm91bmQgPT09IGZhbHNlKXtcbiAgICAgICAgaWYoIW5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy0taGlkZGVuJykpIHJldHVybiBmb3VuZCA9IG5vZGU7XG4gICAgICAgIG5vZGUgPSBub2RlW2Ake2RpcmVjdGlvbn1FbGVtZW50U2libGluZ2BdO1xuICAgIH1cbiAgICByZXR1cm4gZm91bmQ7XG59O1xuXG5jb25zdCBuID0gKG5vZGVOYW1lLCBhdHRycywgY2hpbGRyZW4sIHBhcmVudCA9IGZhbHNlKSA9PiB7XG4gICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcbiAgICBmb3IobGV0IGF0dHIgaW4gYXR0cnMpIG5vZGUuc2V0QXR0cmlidXRlKGF0dHIsIGF0dHJzW2F0dHJdKTtcblxuICAgIG5vZGUgPSBjaGlsZHJlbiA/IGNoaWxkcmVuLnJlZHVjZSgoYWNjLCBjaGlsZCkgPT4ge1xuICAgICAgICBpZih0eXBlb2YgY2hpbGQgPT09ICdzdHJpbmcnKSBhY2MuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY2hpbGQpKTtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCBub2RlKSA6IG5vZGU7XG5cbiAgICByZXR1cm4gbm9kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVQaWxsc0FycmF5ID0gb3B0aW9ucyA9PiBvcHRpb25zLnJlZHVjZSgoYWNjLCBvcHRpb24pID0+IHtcbiAgICBpZihvcHRpb24uc2VsZWN0ZWQpIGFjYy5wdXNoKG4oJ2RpdicsIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdtc19fcGlsbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9sZTogJ2J1dHRvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGEtdmFsdWUnOiBvcHRpb24udmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFiaW5kZXg6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFtvcHRpb24ubGFiZWxdKSk7XG4gICAgcmV0dXJuIGFjYztcbn0sIFtdKTsiXX0=
