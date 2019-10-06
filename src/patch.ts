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
        PATCHS_DOM.push(function() {
            cPatch.action($el, $parent)
        });
    }
    while(cPatch.attrActions && (arrFn = cPatch.attrActions.pop())) {
        PATCHS_DOM.push(function() {
            arrFn($el)
        });
    }
    for(let i = cPatch.childrenPatch.length - 1; i > -1; i --) {
        recursivePatch($el.childNodes[i] as HTMLElement, cPatch.childrenPatch[i], $el);
    }
} 
function doPatchs() {
    changesDo = 0;
    while(changesDo < 40 && PATCHS_DOM.length > 0) {
        changesDo++;
        let fn = PATCHS_DOM.pop();
        fn();
    }

    requestAnimationFrame(doPatchs);
}
requestAnimationFrame(doPatchs);

