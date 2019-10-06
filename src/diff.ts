import { vNodePatch, vNode } from "./interfaces";
import { createElementVNode, isEventProp, removeProp, setProp } from "./createElement";

function diffChildren(oldNode: vNode, newNode: vNode, refs: any): vNodePatch[] {
    const patches = [];
    const patchesLength = Math.max(
        (newNode && newNode.children)?newNode.children.length:0,
        (oldNode && oldNode.children)?oldNode.children.length:0
    );
    for (let i = 0; i < patchesLength; i++) {
        let df: any = diff(
            oldNode.children[i],
            newNode.children[i],
            refs
        )
        if (df) patches[i] = df;
    }
    return patches;
}

function diffAttributes(oldAttrs:any, newAttrs:any, refs:any):Function[] {
    let patches = [];
    const props = Object.assign({}, newAttrs, oldAttrs);
    Object.keys(props).forEach(name => {
        const newVal = newAttrs[name];
        const oldVal = oldAttrs[name];
        if (isEventProp(name)) {
            if (!newVal) {
                patches.push(($node:HTMLElement) => {
                    return $node.removeEventListener(name, oldVal);
                });
            } else if (!oldVal && newVal) {
                patches.push(($node:HTMLElement) => {
                    return $node.addEventListener(name, newVal);
                });
            } else /*if (oldVal && newVal.toString() !== oldVal.toString())*/ {
                //console.log(name, newNode.type);
                patches.push(($node:HTMLElement) => {
                    $node.removeEventListener(name, oldVal);
                    $node.addEventListener(name, newVal);
                });
            }
        } else {
            if (newVal === null || newVal === false) {
                patches.push(($node:HTMLElement) => {
                    removeProp($node, name)
                });
            } else if (oldVal === undefined || JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
                patches.push(($node:HTMLElement) => {
                    setProp($node, name, newVal, refs);
                });
            }
        }

    });
    if(patches.length === 0) patches = null;
    return patches;
  }

export function diff(oldNode: vNode | string, newNode: vNode | string, refs:any):vNodePatch {
    let patch:vNodePatch = {
        action: null,
        attrActions: [],
        childrenPatch: []
    };
    
    if (typeof oldNode === 'string' || typeof newNode === 'string' || typeof oldNode === 'number' || typeof newNode === 'number') {
        if (oldNode !== newNode) {
            patch.action = ($node: HTMLElement) => {
                return $node.replaceWith(createElementVNode(newNode, refs));
            };
        }
        return patch;
    }

    if(oldNode && !newNode) {
        patch.action = ($node: HTMLElement) => {
            if($node.hasAttribute('ref')) {
                delete refs[$node.getAttribute('ref')]
            }
            $node.remove();
            return;
        };
        return patch;
    }
    if(!oldNode && newNode) {
        patch.action = ($node, $parent: HTMLElement) => {
            return $parent.appendChild(createElementVNode(newNode, refs));
        };
        return patch;
    }


    if(oldNode.type !== newNode.type) {
        patch.action = ($node:HTMLElement) => {
            if($node.hasAttribute('ref')) {
                delete refs[$node.getAttribute('ref')]
            }
            return $node.replaceWith(createElementVNode(newNode, refs));
        };
        return patch;
    }

    patch.attrActions = diffAttributes(oldNode.attrs, newNode.attrs, refs);
    patch.childrenPatch = diffChildren(oldNode, newNode, refs);
    return patch;
}