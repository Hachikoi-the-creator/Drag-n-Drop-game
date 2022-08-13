const draggable_list = document.getElementById("draggable-list");
const check = document.getElementById("check");
const scoreSpan = document.getElementById("score");

// HTMLNodes[]
const listItems = [];
// string[]
const theRichest = [];

let dragStartIndex = 0;
let score = 0;
let playing = true;

createList();

check.addEventListener("click", checkOrder);

async function getCurrentRichest() {
  const res = await fetch(
    "https://forbes400.herokuapp.com/api/forbes400?limit=10"
  )
    .then((res) => res.json())
    .catch((err) => console.log(err));

  return res.map((e) => theRichest.push(e.person.name));
}

// Insert list items into DOM
async function createList() {
  await getCurrentRichest();

  const rndArr = randomizeArr(theRichest);

  rndArr.forEach((person, index) => {
    const listItem = document.createElement("li");

    listItem.setAttribute("data-index", index);

    listItem.innerHTML = returnInnerHtml(index + 1, person);

    listItems.push(listItem);

    draggable_list.appendChild(listItem);
  });

  addEventListeners();
}

function dragStart() {
  dragStartIndex = +this.closest("li").getAttribute("data-index");
  console.log("Startting on: ", dragStartIndex);
}

function dragEnter() {
  this.classList.add("over");
}

function dragLeave() {
  this.classList.remove("over");
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop() {
  const dragIndex = +this.getAttribute("data-index");
  swapItems(dragStartIndex, dragIndex);
  console.log("Dropping in: ", dragIndex);

  this.classList.remove("over");
}

// Swap list items that are drag and drop
function swapItems(fromIndex, toIndex) {
  const itemOne = listItems[fromIndex].querySelector(".draggable");
  const itemTwo = listItems[toIndex].querySelector(".draggable");

  listItems[fromIndex].appendChild(itemTwo);
  listItems[toIndex].appendChild(itemOne);
}

// Check the order of list items
function checkOrder() {
  score = 0;

  listItems.forEach(async (listItem, index) => {
    const personName = listItem.querySelector(".draggable").innerText;
    // .trim();

    if (personName === theRichest[index]) {
      listItem.classList.remove("wrong");
      listItem.classList.add("right");
      score += 1 * (index + 1);
    } else {
      listItem.classList.add("wrong");
    }
  });

  // update score span if haven't seen results
  if (playing) scoreSpan.textContent = score;
}

function addEventListeners() {
  const draggables = document.querySelectorAll(".draggable");
  const dragListItems = document.querySelectorAll(".draggable-list li");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", dragStart);
  });

  dragListItems.forEach((item) => {
    item.addEventListener("dragover", dragOver);
    item.addEventListener("drop", dragDrop);
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("dragleave", dragLeave);
  });
}

// * HELPERS
function randomizeArr(arr) {
  /**
   * transforms arr -> object{val:str, sort:int(0-1)}[]
   * Sorts the [{},{}] by the int(0-1)
   * returns an arr of only the val:str
   */
  return arr
    .map((a) => ({ value: a, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
}

function returnInnerHtml(index, person) {
  return `
  <span class="number">${index}</span>
  <div class="draggable" draggable="true">
    <p class="person-name">${person}</p>
    <i class="fas fa-grip-lines"></i>
  </div>
`;
}
