"use strict";

class Tween {
  constructor(params = {}) {
    this.sessionStart = null;
    this.tweens = [];
    this.rawTweens = params.class
      ? document.querySelectorAll("." + params.class + "")
      : document.querySelectorAll("tween");

    window.addEventListener("loaded", this.init());
  }

  init() {
    // PREPARE this.tweens DATA ARRAY
    this.sortTweens();
  }

  sortTweens() {
    for (const elem of this.rawTweens) {
      const tween = {
        node: elem,
        startAt: null,
        reinitAt: null,
        loop: elem.dataset.loop ? parseInt(elem.dataset.loop) : -1,
        trigger: elem.dataset.trigger ? elem.dataset.trigger : "autostart",
        duration: this.getTotalDuration(
          getComputedStyle(elem).animationDuration
        ),
      };

      this.tweens.push(tween);
    }
  }

  getTotalDuration(value) {
    let result = 0;
    const valueList = value.split(",");

    valueList.forEach((val) => {
      result += parseFloat(val) * 1000;
    });

    return result;
  }

  animate(elem) {
    //elem.removeAttribute("style");
    elem.classList.remove("is--tweening");
    void elem.offsetWidth;
    //elem.style.animationPlayState = "running, paused, paused";
    elem.classList.add("is--tweening");
  }

  resetTween() {}
}

export default Tween;
