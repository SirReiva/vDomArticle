import { h } from "./h";
import { createElementVNode } from "./createElement";
import { diff } from "./diff";
import { addPatch } from "./patch";
import { vNode } from "./interfaces";

const tmp = count => <div id="main">
                        <span>Timer:</span>
                        <h1 style="color:red;">{count} {(count > 1)?'segs':'seg'}</h1>
                    </div>;
let rootEl = null;
let acum = 0;

let vd = tmp(acum);

document.getElementById("timer").appendChild(rootEl = createElementVNode(vd, {}));

setInterval(() => {
    acum++;
    let newvd = tmp(acum);
    let p = diff(vd, newvd, {});
    addPatch({
        $root: rootEl,
        patch: p
    });
    vd = newvd;
}, 1000);

/*****todolist******/

let todos = [];
let rfs:any = {};

function template():vNode {
    return <div>
                <input ref="inpt" type="text"/><button onClick={addTodo}>+</button>
                <ul>
                    {todos.map((todo, i) => {
                        return <li>{i}:{todo} - <span style="cursor: pointer;" onClick={() => removeTodo(i)}>X</span></li>;
                    })}
                </ul>
            </div>;
}

function addTodo() {
    if(rfs.inpt.value) {
        todos.push(rfs.inpt.value);
        rfs.inpt.value = '';
        rerender();
    }
}

function removeTodo(index: number) {
    if(todos[index]) {
        todos.splice(index, 1);
        rerender();
    }
}

function rerender() {
    let n = template();
    let p = diff(vdomTodo, n, rfs);
    addPatch({
        $root: $rootEltodo,
        patch: p
    });
    vdomTodo = n;
}

let vdomTodo = template();

let $rootEltodo: HTMLElement = createElementVNode(vdomTodo, rfs) as HTMLElement;

document.getElementById('todo').appendChild($rootEltodo);


