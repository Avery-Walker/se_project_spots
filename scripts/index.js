const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const profileEditButton = document.querySelector(".profile__edit-button");
const addCardBtn = document.querySelector(".profile__add-button");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = document.querySelector(".modal__close");
const editFormEl = editProfileModal.querySelector(".modal__form");
const editModalNameInput = editProfileModal.querySelector(
  "#input-profile-name"
);
const editModalDescriptionInput = editProfileModal.querySelector(
  "#input-profile-description"
);

const addCardModal = document.querySelector("#add-card-modal");
const addCardCloseBtn = addCardModal.querySelector(".modal__close");
const addCardFormEl = addCardModal.querySelector(".modal__form");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");
const captionInputEl = addCardModal.querySelector("#input-card-title");
const linkInputEl = addCardModal.querySelector("#input-card-url");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewNameEl = previewModal.querySelector(".modal__caption");

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImgEl = cardElement.querySelector(".card__image");

  cardNameEl.textContent = data.name;
  cardImgEl.src = data.link;
  cardImgEl.alt = data.name;

  const cardLikeBtnEl = cardElement.querySelector(".card__like-button");
  cardLikeBtnEl.addEventListener("click", () => {
    cardLikeBtnEl.classList.toggle("card__like-button_active");
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");
  cardDeleteBtnEl.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImgEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewNameEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileNameEl.textContent;
  editModalDescriptionInput.value = profileDescriptionEl.textContent;
  hideInputError(editFormEl, editModalNameInput, validationConfig);
  hideInputError(editFormEl, editModalDescriptionInput, validationConfig);
  openModal(editProfileModal);
});

addCardBtn.addEventListener("click", () => {
  openModal(addCardModal);
});

addCardCloseBtn.addEventListener("click", () => closeModal(addCardModal));
editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

editFormEl.addEventListener("submit", function (evt) {
  evt.preventDefault();
  profileNameEl.textContent = editModalNameInput.value;
  profileDescriptionEl.textContent = editModalDescriptionInput.value;
  const buttonElement = evt.target.querySelector(".modal__button");
  disableButton(buttonElement, validationConfig);
  closeModal(editProfileModal);
});

addCardFormEl.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const inputValues = {
    name: captionInputEl.value,
    link: linkInputEl.value,
  };

  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  const buttonElement = evt.target.querySelector(".modal__button");
  disableButton(buttonElement, validationConfig);
  closeModal(addCardModal);
  addCardFormEl.reset();
});

initialCards.forEach(function (item) {
  const cardElement = getCardElement(item);
  cardsList.append(cardElement);
});

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

editProfileModal.addEventListener("click", function (evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(editProfileModal);
  }
});

addCardModal.addEventListener("click", function (evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(addCardModal);
  }
});

previewModal.addEventListener("click", function (evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(previewModal);
  }
});
