import { vNode } from "./interfaces";

const SPECIAL_REFLECT_ATTRIBUTES = ['disabled', 'checked', 'value'];

export function isEventProp(name: string): boolean {
    return /^on/.test(name);
}
export function isFunction(functionToCheck: any): boolean {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

export function isObject(objectToCheck: any): boolean {
    return typeof objectToCheck === 'object'
}

export function extractEventName(name: string): string {
    return name.slice(2).toLowerCase();
}

function setProps(target: HTMLElement, props: any) {
    if (!props) return;
    Object.keys(props).forEach(name => {
        setProp(target, name, props[name]);
    });
}

export function setProp(target: HTMLElement, name: string, value: any) {
    if (typeof value === 'number' || typeof value === 'string') {
        target.setAttribute(name, value.toString());
    } else if(typeof value === 'boolean') {
        (value)?target.setAttribute(name, ''):target.removeAttribute(name);
        if(SPECIAL_REFLECT_ATTRIBUTES.includes(name)) target[name] = value;
    } else if(Array.isArray(value) || isObject(value)) {
        target.setAttribute(name, JSON.stringify(value));
    } else if (isFunction(value)) {
        target.setAttribute(name, '' + value)
    }
}

export function removeProp(target: HTMLElement, propName: string) {
    target.removeAttribute(propName);
    if(SPECIAL_REFLECT_ATTRIBUTES.includes(propName)) {
        target[propName] = false;
    }

}

function addEvent(target: any, event: Function, eventName: string) {
    target.addEventListener(eventName, event);
}

function addEventListeners(target: any, props: any) {
    if (!props) return;
    Object.keys(props).forEach(name => {
        if (isEventProp(name)) {
            // target[name.toLowerCase()] = props[name];
            addEvent(target, props[name], extractEventName(name));
        }
    });
}

export function createElementVNode(node: vNode | string | number): HTMLElement|Text {
    if (typeof node === 'string' || typeof node === 'number') {
        return document.createTextNode(node.toString());
    }
    const el = document.createElement(node.type);
    setProps(el, node.attrs);
    addEventListeners(el, node.attrs);
    if (node.children && node.children.length > 0) {
        const fragChilds = document.createDocumentFragment();
        for(let i = 0; i < node.children.length; i++) {
            let vNonde = createElementVNode(node.children[i]);
            fragChilds.appendChild(vNonde)
        }
        el.appendChild(fragChilds);
    }
    return el;
}