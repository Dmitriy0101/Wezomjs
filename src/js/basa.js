export default {
  loadMore: document.querySelector("[data-load-more]"),
  download: document.querySelector("[data-load-download]"),
  btnOpenContent: document.querySelector("[data-open-content]"),
  usersContainer: document.querySelector("[data-users-container]"),
  usersBody: document.querySelector(".users__body"),
  user: document.querySelector("#user-template"),
  statisticTemplate: document.querySelector("#statistics"),
  statisticContainer: document.querySelector(".statistics"),
  filter: document.querySelector(".filter"),
  form: document.querySelector(".search-form"),
  accordions: [...document.querySelectorAll('.accordion')],
  search: document.querySelector("[data-input-search]"),
  content: document.querySelector(".users-content"),
  select: document.querySelector("#sort-control"),
  allCheckbox: [...document.querySelectorAll('input[type="checkbox"]')],
  paginationList: document.querySelector(".pagination__list"),
  startStep: document.querySelector("#first-step"),
  endStep: document.querySelector("#last-step"),
  prevStep: document.querySelector("#prev-step"),
  nextStep: document.querySelector("#next-step"),
  selectPerPage: document.querySelector("#view-control"),
};
