const tweenData = {
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
const timelineWrapper = document.querySelector(".preview--config-timeline");
const timeline = document.querySelector(".preview--config-timeline__feedback");

let tweens = [];
const style = {};

function Builder() {
  // DEFINE TWEEN COMPONENT OPTIONS
  const select = document.querySelector(".preview--config-select");
  buildTrigger(select);

  // ADD CLEAR BTN
  const btnClear = document.querySelector(".preview--config-btn__clear");
  btnClear.addEventListener("click", () => removeAllTweenComponents());

  // ADD SELECT EVENT LISTENER
  select.addEventListener("change", (event) => {
    addTweenComponent(event.target.value);
  });
}

function buildTrigger(target) {
  const keys = Object.keys(tweenData);

  for (const name of keys) {
    const option = document.createElement("option");
    const css = tweenData[name];

    option.value = name + " " + css;
    option.innerHTML = name;

    target.appendChild(option);
  }
}

function addTweenComponent(option) {
  tweens.push(option);
  drawTweenComponent();
}

function removeAllTweenComponents() {
  tweens = [];
  clearTweenComponent();
  resetExample();

  // UNSELECT INPUT FIELD
  clearSelectComponent();
}

function removeTweenComponent(target) {
  const items = document.querySelectorAll(".preview--config-timeline__item");
  let index = null;

  items.forEach((item, idx) => {
    if (item === target) return (index = idx);
  });

  tweens.splice(index, 1);
  drawTweenComponent();

  // UNSELECT
  if (tweens.length === 0) clearSelectComponent();
}

function clearTweenComponent() {
  const drawedTweenComponents = document.querySelectorAll(
    ".preview--config-timeline__item"
  );

  drawedTweenComponents.forEach((item) => item.remove());
  timeline.removeAttribute("style");
}

function clearSelectComponent() {
  const select = document.querySelector(".preview--config-select");
  select.selectedIndex = -1;
}

function drawTweenComponent() {
  clearTweenComponent();

  for (const item of tweens) {
    const values = item.split(" ");
    const flex = tweens.length > 1 ? parseFloat(values[1]) : 1;

    // BUILD TIMELINE PREVIEW
    const li = document.createElement("li");
    li.classList.add("preview--config-timeline__item");
    li.innerHTML = values[0] + ", " + values[1];
    li.style.flex = flex;
    li.addEventListener("click", (e) => removeTweenComponent(e.target));

    timelineWrapper.appendChild(li);
  }
}

function initTween() {
  const example = document.getElementById("preview-examp");
  iterationCount = calcIterationCount();

  // RESET IDX
  let loopIDX = 0;
  let chainIDX = -1;
  let start;

  // DEFINE STYLES
  style = {
    name: tweens.map((tween) => tween.split(" ")[0]).join(", "),
    duration: tweens.map((tween) => tween.split(" ")[1]).join(", "),
    timingFunction: tweens.map((tween) => tween.split(" ")[2]).join(", "),
    fillMode: tweens.map(() => "forwards").join(", "),
  };

  // CALCULATE DELAY
  Object.assign(style, {
    delay: calcDelay(),
  });

  // CLONE FOR REMOVING EVENT LISTENERS
  //const newExample = example.cloneNode(true);
  //example.parentNode.replaceChild(newExample, example);

  const ts = new Date().getTime();

  // ANIMATION EVENT LISTENERS
  example.addEventListener("animationstart", () => {
    console.log("ANIMATION START", chainIDX);
    console.log(new Date().getTime() - ts);

    chainIDX++;
    /*
      console.log(" ++++++++++++ ");
      console.log(
        "START %c" + tweens[chainIDX - 1],
        "background: #222; color: #bada55"
      );
      console.log(new Date().getTime() - ts);
      */
  });

  example.addEventListener("animationend", () => {
    console.log("ANIMATION END", chainIDX);
    console.log(new Date().getTime() - ts);

    // RESTART TWEEN IN CASE ANIMATION CHAIN ENDED && LOOP NUMBER IS NOT 1
    if (chainIDX >= tweens.length && iterationCount !== 1) {
      chainIDX = 0;
      loopIDX++;

      if (iterationCount !== 0 && loopIDX >= iterationCount)
        return (loopIDX = 0);

      console.log("--> RESTART LOOP");
      runTween();
    }
  });

  // RUN TWEEN
  runTween();
}

function runTween() {
  /*
    if (!animationStartedAt) animationStartedAt = timestamp;

    if (previousTimestamp !== timestamp) {
      elapsed = timestamp - animationStartedAt;
      console.log(elapsed);

      if (elapsed <= 3000) {
        previousTimestamp = timestamp;
        requestAnimationFrame(runTween.bind(this));
      }
    } else {
      cancelAnimationFrame(requestFrame);
      console.log("CANCEL");
    }
    */

  // ELEMENT
  const elem = document.getElementById("preview-examp");

  // RESET EXAMPLE
  resetExample();

  // START ANIMATION
  elem.classList.add("is--tweening");

  // CALC TOTAL TWEEN DURATION
  let totalDuration = 0;
  /*
    style.duration.forEach((dur) => {
      totalDuration += parseFloat(dur);
    });
    */

  //style.animationName = style.name;
  //style.animationDuration = style.duration;
  //style.animationTimingFunction = style.timingFunction;
  //style.animationDelay = style.delay;
  //style.animationFillMode = style.fillMode;
  //style.animationPlayState = "running";

  /*
   // START TIMELINE
   timeline.style.transition = "width " + totalDuration + "s linear";
   timeline.style.width = "100%";
   */
}

function resetExample() {
  // Cancel Animation Frame
  //window.cancelAnimationFrame(requestFrame);

  // RESET EXAMPLE ANIMATION
  const example = document.getElementById("preview-examp");
  example.style.animation = null;
  example.classList.remove("is--tweening");

  // REFLOW BROWSER METHOD FOR RESET
  // AS ALTERNATIVE TRY TO USE https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
  void example.offsetWidth;

  // RESET TRIGGER STATE
  const triggers = document.querySelectorAll(".preview--config-trigger");
  triggers.forEach((trigger) => (trigger.dataset.active = false));

  // RESET TIMELINE
  timeline.removeAttribute("style");
  void timeline.offsetWidth;
}

function calcDelay() {
  const durations = style.duration.split(" ");
  let value = [0];

  durations.forEach((dur, idx) => {
    if (durations.length === 1) return;
    if (idx === durations.length - 1) return;

    const next = parseFloat(dur) + value[idx];
    value.push(next);
  });

  // CONVERT TO CSS READABLE STRING
  value = value.map((val) => val + "s").join(", ");

  return value;
}

function calcIterationCount() {
  const input = document.querySelector(".preview--config-loop");
  return parseInt(input.value);
}

export default Builder;
