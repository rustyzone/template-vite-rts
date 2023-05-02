import React from "react";
import { render } from "react-dom";
import Popup from "./Popup";

console.log("popup script");

const root = document.querySelector("#root");

render(<Popup />, root);
