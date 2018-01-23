import { CLASSNAMES } from './constants';

//<a class="ui label transition visible" data-value="AK" style="display: inline-block !important;">Alaska<i class="delete icon"></i></a>

export const search = () => `<input class="js-ms__search ms__search" autocomplete="off" tabindex="0">`;

export const dropdown = props => `<div class=js-ms__dropdown ms__dropdown" tabindex="-1" hidden>${props.map(options).join('')}</div>`;

const options = props => `<div class="ms__item" data-value="${props.value}">${props.label}</div>`