"use strict";

class Preview {
  constructor(options) {
    this.examples = document.querySelectorAll(".example");
    this.btns = document.querySelectorAll(".example--btn");
    this.tweenData = {
      slideInLeft: "0.5s cubic-bezier(0.25,1,0.5,1)",
      slideInRight: "0.5s cubic-bezier(0.25,1,0.5,1)",
      slideInTop: "0.5s cubic-bezier(0.25,1,0.5,1)",
      slideInBottom: "0.5s cubic-bezier(0.25,1,0.5,1)",
      slideOutLeft: "0.5s cubic-bezier(0.64,0,0.78,0)",
      slideOutRight: "0.5s cubic-bezier(0.64,0,0.78,0)",
      slideOutTop: "0.5s cubic-bezier(0.64,0,0.78,0)",
      slideOutBottom: "0.5s cubic-bezier(0.64,0,0.78,0)",
      wait: "2.5s linear",
    };
    this.timelineWrapper = document.querySelector(".preview--config-timeline");
    this.timeline = document.querySelector(
      ".preview--config-timeline__feedback"
    );
    this.tweens = [];
    this.style = "";

    window.addEventListener("DOMContentLoaded", this.init());
  }

  init() {
    // RUN TWEEN BUILDER
    this.Builder();

    // BTN RUN EVENT LISTENER
    this.run();
  }

  Builder() {
    // DEFINE TWEEN COMPONENT OPTIONS
    const select = document.querySelector(".preview--config-select");
    this.buildTrigger(select);

    // ADD CLEAR BTN
    const btnClear = document.querySelector(".preview--config-btn__clear");
    btnClear.addEventListener("click", () => this.removeAllTweenComponents());

    // ADD SELECT EVENT LISTENER
    select.addEventListener("change", (event) => {
      this.addTweenComponent(event.target.value);
    });
  }

  buildTrigger(target) {
    const keys = Object.keys(this.tweenData);

    for (const name of keys) {
      const option = document.createElement("option");
      const css = this.tweenData[name];

      option.value = name + " " + css;
      option.innerHTML = name;

      target.appendChild(option);
    }
  }

  addTweenComponent(option) {
    this.tweens.push(option);
    this.drawTweenComponent();
  }

  removeAllTweenComponents() {
    this.tweens = [];
    this.clearTweenComponent();
    this.resetExample();

    // UNSELECT INPUT FIELD
    this.clearSelectComponent();
  }

  removeTweenComponent(target) {
    const items = document.querySelectorAll(".preview--config-timeline__item");
    let index = null;

    items.forEach((item, idx) => {
      if (item === target) return (index = idx);
    });

    this.tweens.splice(index, 1);
    this.drawTweenComponent();

    // UNSELECT
    if (this.tweens.length === 0) this.clearSelectComponent();
  }

  clearTweenComponent() {
    const drawedTweenComponents = document.querySelectorAll(
      ".preview--config-timeline__item"
    );

    drawedTweenComponents.forEach((item) => item.remove());
    this.timeline.removeAttribute("style");
  }

  clearSelectComponent() {
    const select = document.querySelector(".preview--config-select");
    select.selectedIndex = -1;
  }

  drawTweenComponent() {
    this.clearTweenComponent();

    for (const item of this.tweens) {
      const values = item.split(" ");
      const flex = this.tweens.length > 1 ? parseFloat(values[1]) : 1;

      // BUILD TIMELINE PREVIEW
      const li = document.createElement("li");
      li.classList.add("preview--config-timeline__item");
      li.innerHTML = values[0] + ", " + values[1];
      li.style.flex = flex;
      li.addEventListener("click", (e) => this.removeTweenComponent(e.target));

      this.timelineWrapper.appendChild(li);
    }
  }

  initTween() {
    const example = document.getElementById("preview-examp");
    const durations = this.tweens.map((tween) => tween.split(" ")[1]);
    const iterationCount = this.calcIterationCount();

    // RESET IDX
    let loopIDX = 0;
    let chainIDX = 0;

    // CLONE FOR REMOVING EVENT LISTENERS
    const newExample = example.cloneNode(true);
    example.parentNode.replaceChild(newExample, example);

    // TWEEN SETUP OPTIONS
    const setup = {
      example: newExample,
      tweenChain: this.tweens.join(", "),
      durations: durations,
      delay: this.calcDelay(durations),
      fillMode: this.tweens.map(() => "forwards").join(", "),
    };

    // ANIMATION EVENT LISTENERS
    newExample.addEventListener("animationstart", () => {
      chainIDX++;
    });

    newExample.addEventListener("animationend", () => {
      // RESTART TWEEN IN CASE LOOP NUMBER IS NOT 1
      if (chainIDX >= this.tweens.length && iterationCount !== 1) {
        chainIDX = 0;
        loopIDX++;

        if (iterationCount !== 0 && loopIDX >= iterationCount)
          return (loopIDX = 0);

        this.runTween(setup);
      }
    });

    // RUN TWEEN
    this.runTween(setup);
  }

  runTween(setup) {
    // CALC TOTAL TWEEN DURATION
    let totalDuration = 0;
    setup.durations.forEach((dur) => {
      totalDuration += parseFloat(dur);
    });

    // RESET EXAMPLE
    this.resetExample();

    // START ANIMATION
    setup.example.style.animation = setup.tweenChain;
    setup.example.style.animationDelay = setup.delay;
    setup.example.style.animationFillMode = setup.fillMode;

    // START TIMELINE
    this.timeline.style.transition = "width " + totalDuration + "s linear";
    this.timeline.style.width = "100%";
  }

  resetExample() {
    // RESET EXAMPLE ANIMATION
    const example = document.getElementById("preview-examp");
    example.style.animation = null;
    example.style.animationDelay = null;
    example.style.animationFillMode = null;

    // REFLOW BROWSER METHOD FOR RESET
    // AS ALTERNATIVE TRY TO USE https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    void example.offsetWidth;

    // RESET TRIGGER STATE
    const triggers = document.querySelectorAll(".preview--config-trigger");
    triggers.forEach((trigger) => (trigger.dataset.active = false));

    // RESET TIMELINE
    this.timeline.removeAttribute("style");
    void this.timeline.offsetWidth;
  }

  calcDelay(durations) {
    let value = [0];

    durations.forEach((dur, idx) => {
      if (durations.length === 1) return;
      if (idx === durations.length - 1) return;

      const next = parseFloat(dur) + value[idx];
      value.push(next);
    });

    // CONVERT TO CSS READABLE STRING
    value = value.map((val) => val + "s").join(",");

    return value;
  }

  calcIterationCount() {
    const input = document.querySelector(".preview--config-loop");
    return parseInt(input.value);
  }

  run() {
    this.btns.forEach((btn, idx) => {
      btn.onclick = () => {
        const isPreviewBuilder =
          btn.className.indexOf("preview--config-btn__run") > -1 ? true : false;

        if (isPreviewBuilder) return this.initTween();

        let property = getComputedStyle(this.examples[idx]).animationName;
        this.examples[idx].style.animationName = "none";

        setTimeout(() => {
          this.examples[idx].style.animationName = property;
        }, 100);
      };
    });
  }
}

new Preview();
