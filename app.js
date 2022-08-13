const draggable_list = document.getElementById("draggable-list");
const theRichest = [];

async function getCurrentRichest() {
  const res = await fetch(
    "https://forbes400.herokuapp.com/api/forbes400?limit=10"
  )
    .then((res) => res.json())
    .catch((err) => console.log(err));

  // res.forEach((e) => theRichest.push(e.person.name));
  return res.map((e) => theRichest.push(e.person.name));
}

document.getElementById("check").addEventListener("click", checkOrder);
document.getElementById("answers").addEventListener("click", showAnswers);

// Store listitems of HTML nodes
const listItems = [];
// helps to swap items
let dragStartIndex;
renderHtmlUL(true, draggable_list);

// Insert list items into DOM
async function renderHtmlUL(rnd, toNode, strArr = []) {
  let arr;
  if (rnd) {
    arr = await getCurrentRichest();
    arr = randomizeArr(strArr);
  } else {
    arr = strArr;
  }

  arr.forEach((person, index) => {
    const item = document.createElement("li");

    item.setAttribute("data-index", index);

    item.innerHTML = `
        <span class="number">${index + 1}</span>
        <div class="draggable" draggable="true">
          <p class="person-name">${person}</p>
          <i class="fas fa-grip-lines"></i>
        </div>
      `;
    if (rnd) listItems.push(item);

    toNode.appendChild(item);
  });
  addEventListeners();
}

function addEventListeners() {
  const draggables = document.querySelectorAll(".draggable");
  const dragListItems = document.querySelectorAll(".draggable-list li");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", dragStart);
  });

  dragListItems.forEach((item) => {
    item.addEventListener("dragover", (e) => dragOver(e));
    item.addEventListener("drop", dragDrop);
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("dragleave", dragLeave);
  });
}

// * DRAG HELPERS
function dragStart() {
  //   console.log("START to Drag these");
  // ?custom attribue added on last forEach
  dragStartIndex = +this.closest("li").getAttribute("data-index");
  console.log("Starts at: ", dragStartIndex);
}

function dragEnter() {
  this.classList.add("over");
  //   console.log("ENTERING these");
}

function dragOver(e) {
  //   console.log("Draggin OVER these");
  e.preventDefault(); //solved the drop detection problem (love mdn)
}

function dragLeave() {
  this.classList.remove("over");
  //   console.log("LEAVING these");
}

function dragDrop() {
  // console.log("DROPPING these");
  const dragEndIndex = +this.getAttribute("data-index");
  this.classList.remove("over");
  // console.log("Dropping at: ", dragEndIndex);
  swapItems(dragStartIndex, dragEndIndex);
}

//* Swaping
function swapItems(fromIndex, toIndex) {
  const draggedItem = listItems[fromIndex].querySelector(".draggable");
  const droppedOn = listItems[toIndex].querySelector(".draggable");
  // console.log(draggedItem, droppedOn);
  // perform the swap
  listItems[fromIndex].appendChild(droppedOn);
  listItems[toIndex].appendChild(draggedItem);
}

//* Check for correct order
function checkOrder() {
  listItems.forEach((item, index) => {
    const personName = item.querySelector(".draggable").innerText;
    // .trim();

    if (personName !== theRichest[index]) {
      item.classList.add("wrong");
    } else {
      item.classList.remove("wrong");
      item.classList.add("right");
    }
  });
}

// end Game logic
function showAnswers() {}

//* Helpers
function randomizeArr(arr) {
  /**
   * Creates an object for every item{"str", rndNum}
   * sorts the oject whit the rndNum
   * gets only the "str"'s and puts then in an arr
   * for every "str" creates an li, updates `listItems` & node `draggable_list`
   */
  [...arr]
    .map((a) => ({ value: a, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
}
