class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }

  //Get all cards
  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  // Create a card
  postNewCard({ cards }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        cards,
      }),
    }).then((res) => {
      if (res.ok) {
        // console.log("working");
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }
  // Delete a card
  deleteCard({ cards }) {
    return fetch(`${this._baseUrl}/cards:cardId`, {
      method: "DELETE",
      headers: this._headers,
      body: JSON.stringify({
        cards,
      }),
    }).then((res) => {
      if (res.ok) {
        // console.log("working");
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  // Like a card
  likeCard({ cards }) {
    return fetch(`${this._baseUrl}/cards/likes`, {
      method: "PUT",
      headers: this._headers,
      body: JSON.stringify({
        cards,
      }),
    }).then((res) => {
      if (res.ok) {
        console.log("working");
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  //Dislike a card
  dislikeCard({ cards }) {
    return fetch(`${this._baseUrl}/cards/likes`, {
      method: "DELETE",
      headers: this._headers,
      body: JSON.stringify({
        cards,
      }),
    }).then((res) => {
      if (res.ok) {
        console.log("working");
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  // Update Avatar
  editAvatar({ avatar }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  // Update your profile information
  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  //Get the current user's info
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }
  //create another method, getUserInfo (different base URL)
  //other methods for working with API
}

export default Api;
