import Greeter from './libs/greeter'
import * as _ from "lodash";
let greeter = new Greeter("JavaScript!");

let button = document.createElement("button");
button.textContent = "Say Hello";
button.onclick = function () {
  alert(greeter.greet());
};

console.log(_)

document.body.appendChild(button);