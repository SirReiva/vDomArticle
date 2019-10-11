export interface vNode {
    type: string;
    attrs: any;
    children: ChildrenNode[]
}

export type ChildrenNode = string | vNode;

export interface vNodePatch {
    action: Function;
    attrActions: Function[];
    childrenPatch: vNodePatch[];
}

export interface vNodePatchQuery {
    $root: HTMLElement;
    patch: vNodePatch;
}