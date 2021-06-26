import "../scss/style.scss";
import basa from "./basa.js";
import env from "./env.js";
import createCard from "./createCard.js";
import wordsUsers from "./wordsUsers.json";

let arrResultUsers = [];
let filtredUsers = [];
const filter = { searchValue: "", gender: [], age: [] };
const sortParams = { selectedOptions: "0", perPage: 5 };
let countUsers = null;
let currentPage = 1;
let totalPages;
let startSliceUsers = 0;
let endSliceUsers = 5;
let isSelectPerpage = false;
let filtredUsersLength = 0;

basa.loadMore.addEventListener("click", onLoad);

function getRandomUser(max) {
  return Math.floor(Math.random() * max + 1);
}

function onLoad(e) {
  showElem(basa.spiner);
  basa.search.value = "";
  basa.usersContainer.innerHTML = "";
  sortParams.selectedOptions = "";
  sortParams.perPage = 5;
  filter.gender = [];
  filter.age = [];
  endSliceUsers = 5;
  basa.selectPerPage.selectedIndex = 0;
  basa.select.selectedIndex = 0;
  currentPage = 1;
  disableChecked();
  fetchUsers();
  filterAccordion();
  onSearch();
  onCheckedFeature();
  onSelect();
  onSelectPerPage();
}

function disableChecked() {
  basa.allCheckbox.forEach((item) => {
    item.checked = false;
  });
}

function getUsers(randomUsers) {
  const url = `${env.BASE_URL}?&results=${randomUsers}`;

  return fetch(url)
      .then((response) => response.json())
      .then(({ results }) => {
        return results;
      });
}

function fetchUsers() {
  getUsers(getRandomUser(100)).then((users) => {
    hiddenElem(basa.spiner);
    arrResultUsers = [...users];
    filterProducts();

    createCard.replaceMurkup(filtredUsers);
    getStatistics(arrResultUsers);
    createPagination();
  });
}

function getStatistics(users) {
  const female = users.filter((user) => user.gender === "female");
  const male = users.filter((user) => user.gender === "male");
  let dominantGender = "";

  if (female > male) {
    dominantGender = "женщин";
  } else if (female < male) {
    dominantGender = "мужчин";
  } else {
    dominantGender = "равное количество";
  }

  const stats = users
      .flatMap((user) => user.nat)
      .reduce(
          (acc, nationality) => ({
            ...acc,
            [nationality]: acc[nationality] ? acc[nationality] + 1 : 1,
          }),
          {}
      );

  const replacesStatistics = createCard.makeStatistics(
      female,
      male,
      users,
      dominantGender,
      createNationalityList(stats)
  );

  basa.statisticContainer.innerHTML = replacesStatistics;
}

function createNationalityList(stats) {
  return Object.entries(stats).map(makeNationalityMarkUp).join("");
}

function makeNationalityMarkUp([key, value]) {
  const declensionUser = declensionAmount(value, wordsUsers.words);

  return `<div>${key}: ${value} ${declensionUser}</div>`;
}

function declensionAmount(number, words) {
  return words[
      number % 100 > 4 && number % 100 < 20
          ? 2
          : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? number % 10 : 5]
      ];
}

function redrawPage() {
  basa.usersContainer.innerHTML = "";
  createCard.replaceMurkup(filtredUsers);
}

/*Задание 2*/

function onSearch() {
  basa.filter.classList.remove("is-hidden");

  basa.search.addEventListener("input", (e) => {
    filter.searchValue = e.target.value.trim().toLowerCase();

    filterProducts();
    redrawPage();
    createPagination();
  });

  basa.search.addEventListener("keypress", (e) => {
    e.keyCode == 13 && e.preventDefault();
  });
}


function onSelect() {
  basa.content.classList.remove("is-hidden");

  basa.select.addEventListener("change", function (e) {
    sortParams.selectedOptions = this.value;

    filterProducts();
    redrawPage();
  });
}


function onCheckedFeature() {
  basa.filter.addEventListener("click", handlerCheckedFeature);
}

function handlerCheckedFeature(e) {
  let arr = e.target.name;
  let value = e.target.value;

  if (e.target.nodeName === "INPUT" && basa.form !== e.target.parentNode) {
    if (!filter[arr].includes(value)) {
      filter[arr].push(value);
    } else {
      filter[arr] = filter[arr].filter((item) => item !== value);
    }
    filterProducts();
    redrawPage();
    createPagination();
  }
}


function filterProducts() {
  filtredUsers = arrResultUsers
      .filter((item) => filtersBySearch(item, filter.searchValue))
      .filter((item) => applyCheckedFields(item.gender, filter.gender))
      .filter((item) => applyCheckedAgeFields(item.dob.age, filter.age))
      .sort(sortByOption(sortParams.selectedOptions));

  getStatistics(filtredUsers);
  filtredUsersLength = filtredUsers.length;
  filtredUsers = filtredUsers.slice(startSliceUsers, endSliceUsers);
}

const optionsSort = {
  0: () => filtersBySearch(sortParams.selectedOptions),
  1: (a, b) => a.name.last.localeCompare(b.name.last),
  2: (a, b) => b.name.last.localeCompare(a.name.last),
  3: (a, b) => b.gender.localeCompare(a.gender),
  4: (a, b) => a.gender.localeCompare(b.gender),
  5: (a, b) =>
      b.gender.localeCompare(a.gender) || a.name.last.localeCompare(b.name.last),
  6: (a, b) =>
      b.gender.localeCompare(a.gender) || b.name.last.localeCompare(a.name.last),
  7: (a, b) =>
      a.gender.localeCompare(b.gender) || a.name.last.localeCompare(b.name.last),
  8: (a, b) =>
      a.gender.localeCompare(b.gender) || b.name.last.localeCompare(a.name.last),
};

function sortByOption(val) {
  if (sortParams.selectedOptions === "0") {
    true;
  } else {
    return optionsSort[val];
  }
}

/* Задание 3*/

function applyCheckedFields(arrParam, filterParam) {
  return filterParam.length === 0 ? true : filterParam.includes(arrParam);
}

function filtersBySearch(item, filterParam) {
  return filterParam === "" ? true : findIncludesElement(item, filterParam);
}

function findIncludesElement(item, val) {
  const includesElemenete =
      item.email.toLowerCase().includes(val) ||
      item.phone.toLowerCase().includes(val) ||
      item.name.first.toLowerCase().includes(val) ||
      item.name.last.toLowerCase().includes(val);
  return includesElemenete;
}

const ranges = {
  "0-35": { min: 0, max: 35 },
  "35-40": { min: 35, max: 40 },
  "40-45": { min: 40, max: 45 },
  "45+": { min: 45, max: Infinity },
};

function applyCheckedAgeFields(age, rangeParam) {
  let range = Object.keys(ranges).find(
      (range) => ranges[range].min <= age && ranges[range].max >= age
  );

  return rangeParam.length === 0 ? true : rangeParam.includes(range);
}

function onSelectPerPage() {
  basa.selectPerPage.addEventListener("change", function (e) {
    !isSelectPerpage;
    if (this.value === "100") {
      sortParams.perPage = 100;
    } else {
      sortParams.perPage = +this.value;
    }

    totalPages = Math.ceil(filtredUsers.length / sortParams.perPage);

    cutUsers();
    filterProducts();
    redrawPage();
    createPagination();
  });
}

 /* Задание 4 Pagination */

function createPagination() {
  totalPages = Math.ceil(filtredUsersLength / sortParams.perPage);
  basa.paginationList.innerHTML = "";
  addPaginationButtons();
  onStepPagination();
}

function pageNumber(totalPages, maxPageVisible, currentPage) {
  let half = Math.round(maxPageVisible / 2);
  let to = maxPageVisible;
  let total = totalPages;
  let maxPages = maxPageVisible;

  if (totalPages < 5) {
    maxPages = totalPages;
    half = 2;
  }

  if (currentPage + half >= total) {
    to = total;
  } else if (currentPage > half) {
    to = currentPage + half;
  } else if (currentPage + half < total) {
    to = maxPages;
  }
  let from = to - maxPages;

  return Array.from({ length: maxPages }, (_, i) => i + 1 + from);
}

function changeStylePagination() {
  const currentActiveLink = document.querySelector(".pagination__item.active");

  currentActiveLink && currentActiveLink.classList.remove("active");

  if (currentPage > 1) {
    basa.startStep.classList.remove("pagination-state--disabled");
    basa.prevStep.classList.remove("pagination-state--disabled");
  } else {
    basa.startStep.classList.add("pagination-state--disabled");
    basa.prevStep.classList.add("pagination-state--disabled");
  }

  if (+currentPage === totalPages) {
    basa.nextStep.classList.add("pagination-state--disabled");
    basa.endStep.classList.add("pagination-state--disabled");
  } else {
    basa.nextStep.classList.remove("pagination-state--disabled");
    basa.endStep.classList.remove("pagination-state--disabled");
  }
}

function onStepPagination() {
  const paginationList = document.querySelector(".pagination__list");

  paginationList.addEventListener("click", function (e) {
    if (e.target.nodeName === "A") {
      currentPage = +e.target.textContent;
    }

    cutUsers();
    filterProducts();
    redrawPage();
    addPaginationButtons();
  });

  basa.nextStep.addEventListener("click", (e) => {
    currentPage += 1;

    addPaginationButtons();
    cutUsers();
    filterProducts();
    redrawPage();
  });

  basa.prevStep.addEventListener("click", (e) => {
    currentPage -= 1;

    addPaginationButtons();
    cutUsers();
    filterProducts();
    redrawPage();
  });

  basa.startStep.addEventListener("click", (e) => {
    currentPage = 1;

    addPaginationButtons();
    cutUsers();
    filterProducts();
    redrawPage();
  });

  basa.endStep.addEventListener("click", (e) => {
    currentPage = totalPages;

    addPaginationButtons();
    cutUsers();
    filterProducts();
    redrawPage();
  });
}

function addPaginationButtons() {
  basa.paginationList.innerHTML = "";
  changeStylePagination();

  let pages = pageNumber(totalPages, 5, currentPage);

  pages.forEach((pageNumber) => {
    const isCurrentPage = currentPage === pageNumber;
    const button = createCard.createPagePaginationMarkUp(
        pageNumber,
        isCurrentPage ? "active" : "",
        false
    );
    basa.paginationList.insertAdjacentHTML("beforeend", button);
  });
}

function cutUsers() {
  startSliceUsers = (currentPage - 1) * sortParams.perPage;
  endSliceUsers = startSliceUsers + sortParams.perPage;
}

function filterAccordion() {
  const dropdownFilter = document.querySelectorAll("[data-select]");

  if (dropdownFilter) {
    dropdownFilter.forEach((elem) => {
      elem.addEventListener("click", changePath);
    });
  }

  function changePath(e) {
    this.querySelector("[data-filter-path]").classList.toggle("is-open");
    this.nextElementSibling.classList.toggle("visually-hidden");
  }
}

function hiddenElem(elem) {
  elem.classList.add("is-hidden");
}

function showElem(elem) {
  elem.classList.remove("is-hidden");
}
