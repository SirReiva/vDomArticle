import { vNode, ChildrenNode } from "./interfaces";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: any;
        }
    }
}

export function h(type: string, attrs: any, ...children: ChildrenNode[]): vNode | null {
    if(!type) return null;
    return {
        type,
        attrs,
        children: [...children].filter(c => c !== null && c !== undefined)
    }
}