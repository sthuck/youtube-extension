import './loader.scss';

export const addLoader = (element: HTMLElement) => {
    element.innerHTML = '<div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
    return element;
}