// fetch from api
// send api response based on search value
// populate page with search inquiry
// populate featured div with my selected breweries
// api address
const domain = "https://api.openbrewerydb.org/breweries";
const submitButton = document.querySelector("#searchSubmit");
const searchHeading = document.querySelector(".main__h3");
const searchContainer = document.querySelector(".searchContainer");
console.log(submitButton);

// when the submit button is press the innerHtml of the searchcontainer will be cleared if there is any
// a fetch request will then be sent and then the searchContainer will populate with the search query
submitButton.addEventListener("click", (ev) => {
  ev.preventDefault();
  searchContainer.innerHTML = "";
  searchHeading.style.display = "block";
  const submitValue = document.querySelector("#searchValue").value;
  const search = domain + "/search?query=" + submitValue;
  console.log(search);
  fetchData(search);
});

const fetchData = (domain) =>
  fetch(domain)
    .then((res) => {
      return res.json();
    })
    .then((resjson) => {
      console.log(resjson);
      domUpdate(resjson);
    })
    .catch((e) => {
      console.log(`Error: ${e}`);
    });

// domElCreate is used to specify what will be created inside domUpdate
const domElCreate = (data, num) => {
  const searchDiv = document.createElement("div");
  const p = document.createElement("p");
  const h3 = document.createElement("h3");
  h3.innerText = `${num + 1}. ${data[num].name}`;
  p.innerHTML = `${data[num].brewery_type} in ${data[num].city}, ${data[num].state}`;
  p.style.textTransform = "capitalize";
  searchContainer.append(searchDiv);
  searchDiv.append(h3, p);
  if (data[num].website_url) {
    const a = document.createElement("a");
    a.innerText = data[num].website_url;
    a.href = data[num].website_url;
    searchDiv.append(a);
  }
  if (data[num].phone) {
    const a = document.createElement("a");
    a.innerText = data[num].phone;
    a.href = `tel:${data[num].phone}`;
    searchDiv.append(a);
  }
};

// function to format each phone number input
// I made this because I hate how the data retrieves raw numbers without the () or -
let formatPhone = (str) => {
  str.insert(0);
};

// function domUpdate is used to update the dom with the fetched API data
// There is an if else statement created in order to not overcrowd the page >> limiting the amount of searched to 10 per page
// There will be a feature to go to either load more or go to the next page
const domUpdate = (resData) => {
  if (resData.length < 10) {
    for (let i = 0; i < resData.length; i++) {
      domElCreate(resData, i);
    }
  } else {
    for (let i = 0; i < 10; i++) {
      domElCreate(resData, i);
    }
  }
};
