import { h } from "./h";
import { createElementVNode } from "./createElement";
import { diff } from "./diff";
import { addPatch } from "./patch";

const tmp = count => <div id="main">
                        <span>Timer:</span>
                        <h1 style="color:red;">{count} {(count > 1)?'segs':'seg'}</h1>
                    </div>;
let rootEl = null;
let acum = 0;

let vd = tmp(acum);

document.getElementById("timer").appendChild(rootEl = createElementVNode(vd));

setInterval(() => {
    acum++;
    let newvd = tmp(acum);
    let p = diff(vd, newvd);
    addPatch({
        $root: rootEl,
        patch: p
    });
    vd = newvd;
}, 1000)