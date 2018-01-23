export const augmentInput = node => {
    let container = n('div', { class: 'ms__container'}),
        search = n('input', { class: 'ms__search', autocomplete: 'off', tabindex: 0 }),
        dropdown = n('div', { class: 'ms__dropdown', tabindex: '-1', hidden: 'hidden'}),
        placeholder = !node.children[0].getAttribute('value') ? n('div', { class: 'ms__placeholder' }, [node.children[0].innerHTML]) : '',
        options = [].slice.call(node.children)
                        .reduce((acc, option) => {
                            if(option.getAttribute('value')) acc.push(n('div', { class: `ms__item`, tabindex: 0,'data-value': option.getAttribute('value')}, [option.innerHTML]));
                            return acc;
                        }, []);

    placeholder && container.appendChild(placeholder);
    container.appendChild(search);
    container.appendChild(options.reduce((dropdown, option) => {
        dropdown.appendChild(option);
        return dropdown;
    }, dropdown));

    node.classList.add('is--hidden');
    node.setAttribute('hidden', 'hidden');
    node.parentNode.replaceChild(container, node);
    container.insertBefore(node, container.firstElementChild);

    return {
        container,
        search,
        dropdown,
        options,
        placeholder,
        originalOptions: [].slice.call(node.children)
    }
};

export const extractOptions = options => options.map(option => ({
    label: option.innerHTML,
    value: option.getAttribute('data-value'),
    node: option,
    selected: false
}));

export const findOption = (options, val) => options.filter(option => option.value === val)[0];

export const findNextFocusableOption = (node, options, direction = 'next') => {
    let found = false;
    while(node && found === false){
        if(!node.classList.contains('is--hidden')) return found = node;
        node = node[`${direction}ElementSibling`];
    }
    return found;
};

const n = (nodeName, attrs, children, parent = false) => {
    let node = document.createElement(nodeName);
    for(let attr in attrs) node.setAttribute(attr, attrs[attr]);

    node = children ? children.reduce((acc, child) => {
        if(typeof child === 'string') acc.appendChild(document.createTextNode(child));
        return acc;
    }, node) : node;

    return node;
};

export const createPillsArray = options => options.reduce((acc, option) => {
    if(option.selected) acc.push(n('div', { 
                            class: 'ms__pill',
                            role: 'button',
                            'data-value': option.value,
                            tabindex: 0
                        }, [option.label]));
    return acc;
}, []);