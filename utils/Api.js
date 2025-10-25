class Api {
  constructor(options) {
    // constuctor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "0669104a-2081-4194-9487-a1a2b010f799",
      },
    }).then((res) => res.json());
  }

  //other methods for working with API
}

export default Api;
