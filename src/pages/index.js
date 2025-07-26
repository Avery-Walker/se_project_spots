import {
  enableValidation,
  validationConfig,
  hideInputError,
  disableButton,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import "./index.css";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "b1fc9154-8cda-44d0-b426-42139d40551d",
    "Content-Type": "application/json",
  },
});

let currentUserId;

const profileEditButton = document.querySelector(".profile__edit-button");
const addCardBtn = document.querySelector(".profile__add-button");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

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
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__button");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = document.querySelector("#delete-form");
const deleteModalCancelBtn = deleteForm.querySelector("button[type='button']");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close");

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

let cardToDelete = null;
let cardToDeleteId = null;

api
  .getAppInfo()
  .then(([userData, cards]) => {
    currentUserId = userData._id;

    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    profileAvatarEl.src = userData.avatar;
    profileAvatarEl.alt = `${userData.name}'s avatar`;

    cards.forEach((card) => {
      const cardElement = getCardElement(card);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

function handleDeleteCardClick(cardElement, cardId) {
  cardToDelete = cardElement;
  cardToDeleteId = cardId;
  openModal(deleteModal);
}

deleteForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  if (!cardToDeleteId || !cardToDelete) return;
  const button = evt.target.querySelector(".modal__button");

  setButtonText(button, true, "Delete", "Deleting...");

  api
    .deleteCard(cardToDeleteId)
    .then(() => {
      cardToDelete.remove();
      closeModal(deleteModal);
      cardToDeleteId = null;
      cardToDelete = null;
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(button, false, "Delete", "Deleting...");
    });
});

deleteModalCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
  cardToDelete = null;
  cardToDeleteId = null;
});

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
  cardToDelete = null;
  cardToDeleteId = null;
});

deleteModal.addEventListener("click", function (evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(deleteModal);
    cardToDelete = null;
    cardToDeleteId = null;
  }
});

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImgEl = cardElement.querySelector(".card__image");
  const likeButtonEl = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardNameEl.textContent = data.name;
  cardImgEl.src = data.link;
  cardImgEl.alt = data.name;

  const ownerId = typeof data.owner === "object" ? data.owner._id : data.owner;
  const isLikedByUser = data.isLiked;

  if (isLikedByUser) {
    likeButtonEl.classList.add("card__like-button_active");
  }

  likeButtonEl.addEventListener("click", () => {
    api
      .changeLikeStatus(data._id, !data.isLiked)
      .then((updatedCard) => {
        data.isLiked = updatedCard.isLiked; // Update local state
        likeButtonEl.classList.toggle(
          "card__like-button_active",
          updatedCard.isLiked
        );
      })
      .catch((error) => {
        console.error("Failed to like card", error);
      });
  });

  if (ownerId !== currentUserId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener("click", () =>
      handleDeleteCardClick(cardElement, data._id)
    );
  }

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
  const button = evt.target.querySelector(".modal__button");

  setButtonText(button, true);

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      const buttonElement = evt.target.querySelector(".modal__button");
      disableButton(buttonElement, validationConfig);
      closeModal(editProfileModal);
    })
    .catch((error) => {
      console.error("Failed to edit user:", error)
    })
    .finally(() => {
      setButtonText(button, false);
    });
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

addCardFormEl.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const button = evt.target.querySelector(".modal__button");

  const inputValues = {
    name: captionInputEl.value,
    link: linkInputEl.value,
  };

  setButtonText(button, true);

  api
    .addCard(inputValues)
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardsList.prepend(cardElement);
      const buttonElement = evt.target.querySelector(".modal__button");
      disableButton(buttonElement, validationConfig);
      closeModal(addCardModal);
      addCardFormEl.reset();
    })
    .catch((error) => {
      console.error("Failed to add card:", error);
    })
    .finally(() => {
      setButtonText(button, false);
    });
});

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const button = evt.target.querySelector(".modal__button");
  const avatarUrl = avatarInput.value;
  setButtonText(button, true);

  api
    .editAvatarInfo(avatarUrl)
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      profileAvatarEl.alt = `${data.name}'s avatar`;
      disableButton(avatarSubmitBtn, validationConfig);
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch((error) => {
      console.error("Failed to change avatar:", error);
    })
    .finally(() => {
      setButtonText(button, false);
    });
}

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

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

avatarModal.addEventListener("click", function (evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(avatarModal);
  }
});

enableValidation(validationConfig);
