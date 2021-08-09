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

    // BTN EVENT LISTENER
    this.run();
  }

  Builder() {
    // DEFINE TWEEN COMPONENT OPTIONS
    const select = document.querySelector(".preview--config-select");
    this.buildTrigger(select);

    // ADD CLEAR BTN
    const btnClear = document.querySelector(".preview--config-btn__clear");
    btnClear.addEventListener("click", () => this.removeAllTweenComponents());

    // ADD RUN BTN
    const runClear = document.querySelector(".preview--config-btn__run");
    runClear.addEventListener("click", () => this.runTween());

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
  }

  removeTweenComponent(target) {
    const items = document.querySelectorAll(".preview--config-timeline__item");
    let index = null;

    items.forEach((item, idx) => {
      if (item === target) return (index = idx);
    });

    this.tweens.splice(index, 1);
    this.drawTweenComponent();
  }

  clearTweenComponent() {
    const drawedTweenComponents = document.querySelectorAll(
      ".preview--config-timeline__item"
    );

    drawedTweenComponents.forEach((item) => item.remove());
    this.timeline.removeAttribute("style");
  }

  drawTweenComponent() {
    this.clearTweenComponent();

    for (const item of this.tweens) {
      const values = item.split(" ");

      // BUILD TIMELINE PREVIEW
      const li = document.createElement("li");
      li.classList.add("preview--config-timeline__item");
      li.innerHTML = values[0] + ", " + values[1];
      li.style.flex = parseFloat(values[1]);
      li.addEventListener("click", (e) => this.removeTweenComponent(e.target));

      this.timelineWrapper.appendChild(li);
    }
  }

  runTween() {
    const example = document.getElementById("preview-examp");
    const tweenChain = this.tweens.join(", ");
    const name = this.tweens.map((tween) => tween.split(" ")[1]);
    const fillMode = this.tweens.map(() => "forwards").join(", ");
    const durations = this.tweens.map((tween) => tween.split(" ")[1]);
    const delay = this.calcDelay(durations);
    let totalDuration = 0;

    // RESET
    example.removeAttribute("style");
    this.timeline.removeAttribute("style");

    setTimeout(() => {
      // SET ANAIMTIONS
      example.style.animation = tweenChain;
      example.style.animationDelay = delay;
      example.style.animationFillMode = fillMode;
      // TIMELINE FEEDBACK
      durations.forEach((dur) => (totalDuration += parseFloat(dur)));
      this.timeline.style.transition = "width " + totalDuration + "s linear";
      this.timeline.style.width = "calc(100% - 20px)";
    }, 1);
  }

  resetExamples() {
    // RESET EXAMPLE ANIMATION
    const example = document.getElementById("preview-examp");
    example.style.animationName = "none";

    // RESET TRIGGER STATE
    const triggers = document.querySelectorAll(".preview--config-trigger");
    triggers.forEach((trigger) => (trigger.dataset.active = false));

    // RESET TIMELINE
    this.timeline.removeAttribute("style");
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

  run() {
    this.btns.forEach((btn, idx) => {
      btn.onclick = () => {
        let property = getComputedStyle(this.examples[idx]).animationName;
        this.examples[idx + 1].style.animationName = "none";

        setTimeout(() => {
          this.examples[idx + 1].style.animationName = property;
        }, 100);
      };
    });
  }
}

new Preview();
