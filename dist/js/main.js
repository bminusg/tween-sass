"use strict";

import Tween from "./modules/tween.js";
import Builder from "./modules/builder.js";

class Preview {
  constructor(options) {
    this.examples = document.querySelectorAll(".example");
    this.btns = document.querySelectorAll(".example--btn");

    window.addEventListener("DOMContentLoaded", this.init());
  }

  init() {
    // RUN TWEEN BUILDER
    const builderNode = document.querySelector("#builder");
    if (builderNode) Builder();

    this.tween = new Tween({
      class: "example",
    });

    // BTN RUN EVENT LISTENER
    const triggerEvent = "ontouchstart" in window ? "touchstart" : "click";
    this.btns.forEach((btn, idx) => {
      btn.addEventListener(triggerEvent, (event) => {
        event.preventDefault();

        this.tween.animate(btn);
      });
    });
  }
}

new Preview();
