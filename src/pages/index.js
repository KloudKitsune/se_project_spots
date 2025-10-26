import "./index.css";
import Api from "../../utils/Api.js";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";

// const initialCards = [
//   {
//     name: "Golden Gate Bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },

//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },

//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },

//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },

//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },

//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },

//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];

//Profile Elements
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const profileAvatarEl = document.querySelector(".profile__avatar");

// Avatar form Elements
const avatarModal = document.querySelector("#edit-avatar-modal"); // The modal itself
const avatarForm = avatarModal.querySelector("#edit-avatar-form"); // The form inside modal
const avatarSubmitBtn = avatarForm.querySelector(".modal__submit-btn"); // Save button
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn"); // Close button
const avatarModalBtn = document.querySelector(".profile__avatar-btn"); // Button that opens the modal
const avatarInput = avatarForm.querySelector("#profile-avatar-input"); // The input field for avatar URL

const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form"); //new post modal form
const cardSubmitBtn = newPostModal.querySelector(".modal__submit-btn");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const newPostImageInput = document.querySelector("#card-image-input"); //card image input
const newPostCaptionInput = document.querySelector("#card-caption-input"); //card caption input

const previewModal = document.querySelector("#preview-modal"); // priview modal
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image_preview");
const previewCaption = previewModal.querySelector(".modal__caption");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card"); // card template HTML

const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  const deleteModal = document.querySelector("#delete-modal");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  // Like and Dislike API logic using contains instead of toggle
  cardLikeBtnEl.addEventListener("click", () => {
    if (cardLikeBtnEl.classList.contains("card__like-btn_active")) {
      api
        .dislikeCard(data._id)
        .then(() => {
          cardLikeBtnEl.classList.remove("card__like-btn_active");
        })
        .catch((err) => console.error("Error unliking card:", err));
    } else {
      api
        .likeCard(data._id)
        .then(() => {
          cardLikeBtnEl.classList.add("card__like-btn_active");
        })
        .catch((err) => console.error("Error liking card:", err));
    }
  });

  // Delete a card w/ API
  cardDeleteBtnEl.addEventListener("click", () => {
    openModal(deleteModal);

    const confirmDeleteHandler = (evt) => {
      evt.preventDefault();

      api
        .deleteCard(data._id)
        .then(() => {
          cardElement.remove();
          closeModal(deleteModal);
        })
        .catch((err) => console.error("Delete error:", err))
        .finally(() => {
          deleteForm.removeEventListener("submit", confirmDeleteHandler);
        });
    };

    // deleteForm.addEventListener("submit", confirmDeleteHandler);
  });

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
  .then(([cards, data]) => {
    //Could add data to the first parameter
    //Setup user info on the page

    console.log(data);
    profileNameEl.textContent = data.name;
    profileDescriptionEl.textContent = data.about;
    // profileAvatarEl.src = data.avatar;

    cards.forEach(function (item) {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })
  .catch((err) => {
    console.error(err);
  });

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
  api
    .createNewCard({
      name: newPostCaptionInput.value, //API create Card
      link: newPostImageInput.value,
    })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);

      closeModal(newPostModal);
      evt.target.reset();
    })
    .catch((err) => {
      console.error("Error creating card:", err);
    })
    .finally(() => {
      cardSubmitBtn.disabled = false;
    });

  // const inputValues = {
  //   name: newPostCaptionInput.value, //test post
  //   link: newPostImageInput.value, // test post
  // };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement); // test post
  closeModal(newPostModal);
  evt.target.reset();
  disableButton(cardSubmitBtn, settings);
}

// Avatar Edit function
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  api
    .editAvatarInfo({
      avatar: avatarInput.value,
    })
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch((err) => {
      console.error("Error updating avatar:", err);
    });
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
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
    .catch(console.error);
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
