import { vNodePatch, vNodePatchQuery } from "./interfaces";

let PATCHS_DOM: Function[] = [];

declare var window: any;
const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;

let currentPatch:vNodePatch = null;
let currentPatchEl: HTMLElement = null;
export function addPatch(p: vNodePatchQuery) {
    recursivePatch(p.$root, p.patch, p.$root.parentElement);
}
const MAX_CHANGES = 40;
let changesDo = 0;
function recursivePatch($el: HTMLElement, cPatch: vNodePatch, $parent: HTMLElement) {
    let arrFn;
    if(cPatch.action) {
        addToCallStack(cPatch.action ,$el, $parent);
    }
    while(cPatch.attrActions && (arrFn = cPatch.attrActions.pop())) {
        addToCallStack(arrFn, $el ,null);
    }
    if ($el && $el.childNodes) {
        for(let i = cPatch.childrenPatch.length - 1; i > -1; i --) {
            recursivePatch($el.childNodes[i] as HTMLElement, cPatch.childrenPatch[i], $el);
        }
    }
}

function addToCallStack(fn, attr1, attr2) {
    if(fn) {
        PATCHS_DOM.push(() => {
            fn(attr1, attr2);
        });
    }
}

function doPatchs() {
    changesDo = 0;
    while(changesDo < 40 && PATCHS_DOM.length > 0) {
        changesDo++;
        let fn = PATCHS_DOM.shift();
        fn();
    }

    requestAnimationFrame(doPatchs);
}
requestAnimationFrame(doPatchs);

