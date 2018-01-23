import MultiSelect from './libs/component';

const onDOMContentLoadedTasks = [() => {
    MultiSelect.init('.js-multi-select');

    // document.querySelector('.js-form').addEventListener('submit', e => {});

    // document.querySelector('.js-form').addEventListener('submit', e => {
    //     e.preventDefault();
    //     console.log(Array.from(e.target.select.selectedOptions).reduce((acc, curr) => {
    //         acc.push(curr.value);
    //         return acc;
    //     }, []));
    // });
}];
    
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach((fn) => fn()); });