import "./index.css";
import Api from "../utils/Api.js";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";

//Profile Elements
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

// Profile Input Elements
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

// Delete Modal Elements
let selectedCard;
let selectedCardId;

const deleteModal = document.querySelector("#delete-modal");
const deleteCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteCancelBtn = deleteModal.querySelector(".modal__cancel-btn");
const deleteForm = deleteModal.querySelector(".delete__form");

// Delete Modal Close Listeners
deleteCloseBtn.addEventListener("click", () => closeModal(deleteModal));
deleteCancelBtn.addEventListener("click", () => closeModal(deleteModal));

// Delete Form Submit Handler
deleteForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const btn = evt.submitter;
  btn.textContent = "Deleting...";

  if (!selectedCard || !selectedCardId) return;

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
      selectedCard = null;
      selectedCardId = null;
    })
    .catch((err) => console.error("Delete error:", err))
    .finally(() => {
      btn.textContent = "Delete";
    });
});

// Avatar form Elements
const avatarModal = document.querySelector("#edit-avatar-modal"); // The modal itself
const avatarForm = avatarModal.querySelector("#edit-avatar-form"); // The form inside modal
const avatarSubmitBtn = avatarForm.querySelector(".modal__submit-btn"); // Save button
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn"); // Close button
const avatarModalBtn = document.querySelector(".profile__avatar-btn"); // Button that opens the modal
const avatarInput = avatarForm.querySelector("#profile-avatar-input"); // The input field for avatar URL
const profileAvatarEl = document.querySelector(".profile__avatar");

// New Post Elements
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form"); //new post modal form
const cardSubmitBtn = newPostModal.querySelector(".modal__submit-btn");

// New Post Input
const newPostImageInput = document.querySelector("#card-image-input"); //card image input
const newPostCaptionInput = document.querySelector("#card-caption-input"); //card caption input

// Preview Modal Elements
const previewModal = document.querySelector("#preview-modal"); // preview modal
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image_preview");
const previewCaption = previewModal.querySelector(".modal__caption");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card"); // card template HTML

const cardsList = document.querySelector(".cards__list");

let currentUserId = null;

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  // Use isLiked to set button state
  if (data.isLiked) {
    cardLikeBtnEl.classList.add("card__like-btn_active");
  }

  // Like and Dislike logic
  cardLikeBtnEl.addEventListener("click", () => {
    cardLikeBtnEl.disabled = true; // optional: disable to prevent spam clicks

    const likePromise = cardLikeBtnEl.classList.contains(
      "card__like-btn_active"
    )
      ? api.removeLike(data._id)
      : api.addLike(data._id);

    likePromise
      .then((updatedCard) => {
        cardLikeBtnEl.classList.toggle(
          "card__like-btn_active",
          updatedCard.isLiked
        );
        data.isLiked = updatedCard.isLiked; // update local isLiked
      })
      .catch((err) => console.error("Error updating like:", err))
      .finally(() => {
        cardLikeBtnEl.disabled = false;
      });
  });

  // Delete button API logic
  cardDeleteBtnEl.addEventListener("click", () => {
    selectedCard = cardElement;
    selectedCardId = data._id;
    openModal(deleteModal);
  });

  // Preview modal
  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

//API configuration
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "0669104a-2081-4194-9487-a1a2b010f799",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userData]) => {
    currentUserId = userData._id;

    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    profileAvatarEl.src = userData.avatar;

    cards.forEach((card) => {
      const cardElement = getCardElement(card);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);

// Close modal when clicking on the overlay
const allModals = document.querySelectorAll(".modal");

allModals.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

// Close modal when pressing the ESC key
function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal.modal_is-opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

//function for opening and closing modals
function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;

  // Optional reset of validation for Edit Profile line 41 on validation.js
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

previewModalCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

// Adding a card to the DOM via API
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const btn = evt.submitter;
  setButtonText(btn, true);

  cardSubmitBtn.disabled = true;

  api
    .createNewCard({
      name: newPostCaptionInput.value, //API create Card
      link: newPostImageInput.value,
    })
    .then((data) => {
      data.likes = Array.isArray(data.likes) ? data.likes : [];
      const cardElement = getCardElement(data, currentUserId);
      cardsList.prepend(cardElement);

      closeModal(newPostModal);
      evt.target.reset();
      disableButton(cardSubmitBtn, settings);
    })
    .catch((err) => {
      console.error("Error creating card:", err);
    })
    .finally(() => {
      setButtonText(btn, false);
      cardSubmitBtn.disabled = false;
    });
}

// Avatar Edit function
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const btn = evt.submitter;
  setButtonText(btn, true);

  api
    .editAvatarInfo({ avatar: avatarInput.value })
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch((err) => {
      console.error("Error updating avatar:", err);
    })
    .finally(() => setButtonText(btn, false));
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const btn = evt.submitter;
  setButtonText(btn, true);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      // profileAvatarEl = data.avatar;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(btn, false));
}

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});
avatarModalCloseBtn.addEventListener("click", function () {
  closeModal(avatarModal);
});
avatarForm.addEventListener("submit", handleAvatarSubmit);

editProfileForm.addEventListener("submit", handleEditProfileSubmit);
newPostForm.addEventListener("submit", handleAddCardSubmit); // new post event listener

enableValidation(settings);
