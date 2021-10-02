// fetch from api
// send api response based on search value
// populate page with search inquiry
// populate featured div with my selected breweries
// api address
const domain = "https://api.openbrewerydb.org/breweries";
const submitButton = document.querySelector("#searchSubmit");
const searchHeading = document.querySelector(".main__h3");
const searchContainer = document.querySelector(".searchContainer");
const pageBtns = document.querySelector(".pageBtns");
let pageCounter = 0;

// when the submit button is press the innerHtml of the searchcontainer will be cleared if there is any
// a fetch request will then be sent and then the searchContainer will populate with the search query
submitButton.addEventListener("click", (ev) => {
  pageCounter = 0;
  ev.preventDefault();
  searchContainer.innerHTML = "";
  pageBtns.innerHTML = "";
  searchHeading.style.display = "block";
  const submitValue = document.querySelector("#searchValue").value;
  const search = domain + "/search?query=" + submitValue;
  fetchData(search);
});

// function fetchData is used to send the get the api request, also contains domUpdate in order to update the DOM content
const fetchData = (domain) =>
  fetch(domain)
    .then((res) => {
      return res.json();
    })
    .then((resjson) => {
      domUpdate(resjson);

      // If api content that comes back is greater than 10, then the nextBtn and prevBtn allow to dynamically update the page through the
      if (resjson.length > 10) {
        const prevBtn = document.createElement("button");
        const nextBtn = document.createElement("button");
        prevBtn.innerText = "previous";
        nextBtn.innerText = "next";
        prevBtn.className = "previous";
        nextBtn.className = "next";
        pageBtns.append(prevBtn, nextBtn);
        nextBtn.style.display = "block";
        nextBtn.addEventListener("click", () => {
          console.log(pageCounter);
          searchContainer.innerHTML = "";
          pageCounter++;
          domUpdate(resjson);
          prevBtn.style.display = "block";
          if (resjson.length - pageCounter * 10 < 10) {
            nextBtn.style.display = "none";
          }
        });

        prevBtn.addEventListener("click", () => {
          searchContainer.innerHTML = "";
          pageCounter--;
          domUpdate(resjson);
          nextBtn.style.display = "block";
          if (pageCounter === 0) {
            prevBtn.style.display = "none";
          }
        });
      }
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
    a.innerText = formatPhone(data[num].phone);
    a.href = `tel:${data[num].phone}`;
    searchDiv.append(a);
  }
};

// function to format each phone number input
// I made this because I hate how the data retrieves raw numbers without the () or -
const formatPhone = (str) => {
  const results = str.split("");
  results.splice(0, 0, "(");
  results.splice(4, 0, ") ");
  results.splice(8, 0, "-");
  return results.join("");
};

// function domUpdate is used to update the dom with the fetched API data
// There is an if else statement created in order to not overcrowd the page >> limiting the amount of searched to 10 per page
// There will be a feature to go to either load more or go to the next page
// also updates the tempHolder array for if the fetch data returns with more than 10 items
const domUpdate = (resData) => {
  if (resData.length < 10 || resData.length - pageCounter * 10 < 10) {
    for (let i = 10 * pageCounter; i < resData.length; i++) {
      domElCreate(resData, i);
    }
  } else if (pageCounter === 0) {
    for (let i = 0; i < 10; i++) {
      domElCreate(resData, i);
    }
  } else {
    const counter = pageCounter + 1;
    for (let i = 10 * pageCounter; i < 10 * counter; i++) {
      domElCreate(resData, i);
    }
  }
};
