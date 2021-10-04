// fetch from api
// send api response based on search value
// populate page with search inquiry
// populate featured div with my selected breweries
// api address
const header = document.querySelector("body > header");
const searchForm = document.querySelector("#search__form");
const headerH1 = document.querySelector("body > header > h1");
const domain = "https://api.openbrewerydb.org/breweries";
const linkPrevDomain =
  "http://api.linkpreview.net/?key=f14050be5f1332fc8bd9e8d9f84db942&q=";
const submitButton = document.querySelector("#searchSubmit");
const searchHeading = document.querySelector(".main__h3");
const searchContainer = document.querySelector(".searchContainer");
const pageBtns = document.querySelector(".pageBtns");
let pageCounter;

// when the submit button is press the innerHtml of the searchcontainer will be cleared if there is any
// a fetch request will then be sent and then the searchContainer will populate with the search query
submitButton.addEventListener("click", (ev) => {
  header.classList.remove("headerNl");
  header.className = "headerSearch";
  headerH1.style.marginRight = "25px";
  searchForm.style.margin = "0";
  pageCounter = 0;
  ev.preventDefault();
  searchContainer.innerHTML = "";
  pageBtns.innerHTML = "";
  searchHeading.style.display = "block";
  const submitValue = document.querySelector("#searchValue").value;
  const search = domain + "/search?query=" + submitValue;
  fetchBrewData(search);
});

// function fetchData is used to send the get the api request, also contains domUpdate in order to update the DOM content
const fetchBrewData = (domain) =>
  fetch(domain)
    .then((res) => {
      return res.json();
    })
    .then((resjson) => {
      console.log(resjson);
      domUpdate(resjson);

      // If api content that comes back is greater than 10, then the nextBtn and prevBtn allow to dynamically update the page
      if (resjson.length > 10) {
        // code for adding the prevBtn and nextBtn elements
        const prevBtn = document.createElement("button");
        const nextBtn = document.createElement("button");
        prevBtn.innerText = "previous";
        nextBtn.innerText = "next";
        prevBtn.className = "previous";
        nextBtn.className = "next";
        pageBtns.append(prevBtn, nextBtn);
        nextBtn.style.display = "block";

        //nextBtn event listener
        nextBtn.addEventListener("click", () => {
          searchContainer.innerHTML = "";
          pageCounter++;
          domUpdate(resjson);
          prevBtn.style.display = "block";
          if (resjson.length - pageCounter * 10 < 10) {
            nextBtn.style.display = "none";
          }
        });

        //prevBtn event listener
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

const fetchLinkPreview = (domain) => {
  fetch(domain)
    .then((res) => {
      return res.json();
    })
    .then((resjson) => {
      console.log(resjson);
    })
    .catch((e) => {
      console.log(`Error: ${e}`);
    });
};

// domElCreate is used to specify what will be created inside domUpdate
const domElCreate = (data, num) => {
  const searchDiv = document.createElement("div");
  const p = document.createElement("p");
  const h3 = document.createElement("h3");
  searchDiv.className = "searchDiv";
  h3.innerText = `${num + 1}. ${data[num].name}`;
  p.innerHTML = `${data[num].brewery_type} in ${data[num].city}, ${data[num].state}`;
  p.style.textTransform = "capitalize";
  searchContainer.append(searchDiv);
  searchDiv.append(h3, p);
  if (data[num].street) {
    const address = document.createElement("address");
    address.innerHTML = `${data[num].street}, ${data[num].state}, ${data[num].state}`;
    searchDiv.append(address);
  }
  if (data[num].phone) {
    const phone = document.createElement("a");
    phone.innerText = formatPhone(data[num].phone);
    phone.href = `tel:${data[num].phone}`;
    searchDiv.append(phone);
  }
  if (data[num].website_url) {
    const website = document.createElement("a");
    website.innerText = data[num].website_url;
    website.href = data[num].website_url;
    searchDiv.append(website);
    h3.innerText = "";
    const a = document.createElement("a");
    a.innerText = `${num + 1}. ${data[num].name}`;
    a.href = "#";
    h3.append(a);
    a.addEventListener("click", () => {
      fetchLinkPreview(linkPrevDomain + data[num].website_url);
    });
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
