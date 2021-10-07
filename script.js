// fetch from api
// send api response based on search value
// populate page with search inquiry
// populate featured div with my selected breweries
// api address
const apiKey = config.geoKey;
const header = document.querySelector("body > header");
const searchForm = document.querySelector("#search__form");
const domain = "https://api.openbrewerydb.org/breweries";
const microlinkDomain = "https://api.microlink.io?url=";
const submitButton = document.querySelector("#searchSubmit");
const searchHeading = document.querySelector(".main__h3");
const searchContainer = document.querySelector(".searchContainer");
const pageBtns = document.querySelector(".pageBtns");
const loadingContainer = document.querySelector(".loadingContainer");
const favorites__container = document.querySelector(".favorites__container");
// credit to Josh Olalde on unsplash for the photo
const beerStockPhoto =
  "https://images.unsplash.com/photo-1535958636474-b021ee887b13?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80";
let pageCounter;

// when the submit button is press the innerHtml of the searchcontainer will be cleared if there is any
// a fetch request will then be sent and then the searchContainer will populate with the search query
submitButton.addEventListener("click", (ev) => {
  loadingContainer.style.display = "flex";
  setTimeout(() => {
    loadingContainer.style.display = "none";
  }, 2000);
  header.classList.remove("headerNl");
  header.className = "headerSearch";
  searchForm.style.margin = "0";
  pageCounter = 0;
  ev.preventDefault();
  searchContainer.innerHTML = "";
  pageBtns.innerHTML = "";
  searchHeading.style.display = "block";
  const submitValue = document
    .querySelector("#searchValue")
    .value.toLowerCase();
  // if the submit value is left blank or current location is typed in then the visitor's current longitude and latitude is used to find the search
  if (submitValue == "" || submitValue == "current location") {
    fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=${apiKey}`)
      .then((res) => {
        return res.json();
      })
      .then((resjson) => {
        const search =
          domain +
          "?by_dist=" +
          resjson.latitude +
          "," +
          resjson.longitude +
          "&per_page=2";
        fetchBrewData(search);
      });
  } else {
    const search = domain + "?by_city=" + submitValue + "&per_page=2";
    fetchBrewData(search);
  }
});

// function fetchData is used to send the get the api request, also contains domUpdate in order to update the DOM content
const fetchBrewData = (domain) =>
  fetch(domain)
    .then((res) => {
      return res.json();
    })
    .then((resjson) => {
      domUpdate(resjson);

      // If api content that comes back is greater than 10, then the nextBtn and prevBtn allow to dynamically update the page
      if (resjson.length > 10) {
        // code for adding the prevBtn and nextBtn elements
        const prevBtn = document.createElement("button");
        const nextBtn = document.createElement("button");
        prevBtn.innerHTML = `<span class="material-icons">chevron_left</span>`;
        nextBtn.innerHTML = `<span class="material-icons">chevron_right</span>`;
        prevBtn.className = "previous";
        nextBtn.className = "next";
        pageBtns.append(prevBtn, nextBtn);
        nextBtn.style.display = "block";

        //nextBtn event listener
        nextBtn.addEventListener("click", () => {
          loadingContainer.style.display = "flex";
          setTimeout(() => {
            loadingContainer.style.display = "none";
          }, 1000);
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

// domElCreate is used to specify what will be created inside domUpdate
const domElCreate = (data, num) => {
  const searchDiv = document.createElement("div");
  const infoDiv = document.createElement("div");
  const p = document.createElement("p");
  const h3 = document.createElement("h3");
  const brewImg = document.createElement("div");
  const heartIcon = document.createElement("span");
  infoDiv.className = "infoDiv";
  searchDiv.className = "searchDiv";
  brewImg.className = "brewImg";
  brewImg.style.backgroundImage = `url(${beerStockPhoto})`;
  heartIcon.innerText = "favorite";
  heartIcon.classList.add("material-icons", "brewImg__heartIcon");
  heartIcon.value = data[num].id;
  // checks local storage to see if that brewery item already has been liked and if so turns the heart red
  if (Object.keys(localStorage).includes(heartIcon.value)) {
    heartIcon.style.color = "red";
  }
  h3.className = "infoDiv__H3";
  h3.innerText = `${num + 1}. ${data[num].name}`;
  p.innerHTML = `${data[num].brewery_type} in ${data[num].city}, ${data[num].state}`;
  p.style.textTransform = "capitalize";
  searchContainer.append(searchDiv);
  searchDiv.append(brewImg, infoDiv);
  brewImg.append(heartIcon);
  infoDiv.append(h3, p);
  heartIcon.addEventListener("click", () => {
    const heartValue = heartIcon.value;
    localStorage.setItem(heartValue, heartValue);
    console.log(localStorage.getItem(heartValue));
    heartIcon.style.color = "red";
  });
  if (data[num].street) {
    const address = document.createElement("address");
    address.innerHTML = `${data[num].street}, ${data[num].state}, ${data[num].state} ${data[num].postal_code}`;
    infoDiv.append(address);
  }
  if (data[num].phone) {
    const phone = document.createElement("a");
    phone.innerHTML = formatPhone(data[num].phone);
    phone.href = `tel:${data[num].phone}`;
    infoDiv.append(phone);
  }
  if (data[num].website_url) {
    // fetches website data using the microlink API
    fetch(microlinkDomain + data[num].website_url)
      .then((res) => {
        return res.json();
      })
      .then((resjson) => {
        // checks if the statuscode of the website is 200 and if so then the website is added
        if (
          resjson.statusCode === 200 &&
          resjson.data.image !== null &&
          resjson.data.image.height > 1
        ) {
          const website = document.createElement("a");
          const description = document.createElement("p");
          website.className = "infoDiv__website";
          description.className = "infoDiv__description";
          description.innerHTML = `"${resjson.data.description}"`;
          brewImg.style.backgroundImage = `url(${resjson.data.image.url})`;
          website.innerText = h3.innerText;
          website.href = data[num].website_url;
          infoDiv.append(description);
          h3.innerText = "";
          h3.append(website);
        }
      })
      .catch((e) => {
        console.log(`Error: ${e}`);
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

// everytime a brewery favorite button is clicked, that brewery is added to favorites

// make a favorites button when each brewery is generated = DONE
// addeventlistener that waits until the favbtn is clicked = DONE
// each favbtn is assigned a value equal to the brewery id on openbrewerydb = DONE
// function runs which saves that brewery id into localStorage = DONE
// favorites page fetches info from openbreweryDB looping through every id from the localStorage = DONE
// delete btn is generated on each instance which has an eventlistener when clicked will localStorage.removeItem(id)

for (let i = 0; i < localStorage.length; i++) {
  console.log(domain + "/" + Object.keys(localStorage)[i]);
  fetch(domain + "/" + Object.keys(localStorage)[i])
    .then((res) => {
      return res.json();
    })
    .then((resjson) => {
      console.log(resjson);
      const searchDiv = document.createElement("div");
      const infoDiv = document.createElement("div");
      const p = document.createElement("p");
      const h3 = document.createElement("h3");
      const brewImg = document.createElement("div");
      infoDiv.className = "infoDiv";
      searchDiv.className = "searchDiv";
      brewImg.className = "brewImg";
      brewImg.style.backgroundImage = `url(${beerStockPhoto})`;
      h3.className = "infoDiv__H3";
      h3.innerText = resjson.name;
      p.innerHTML = `${resjson.brewery_type} in ${resjson.city}, ${resjson.state}`;
      p.style.textTransform = "capitalize";
      favorites__container.append(searchDiv);
      searchDiv.append(brewImg, infoDiv);
      infoDiv.append(h3, p);
      if (resjson.street) {
        const address = document.createElement("address");
        address.innerHTML = `${resjson.street}, ${resjson.state}, ${resjson.state} ${resjson.postal_code}`;
        infoDiv.append(address);
      }
      if (resjson.phone) {
        const phone = document.createElement("a");
        phone.innerHTML = formatPhone(resjson.phone);
        phone.href = `tel:${resjson.phone}`;
        infoDiv.append(phone);
      }
      if (resjson.website_url) {
        // fetches website data using the microlink API
        fetch(microlinkDomain + resjson.website_url)
          .then((res) => {
            return res.json();
          })
          .then((resjson) => {
            console.log(resjson);
            // checks if the statuscode of the website is 200 and if so then the website is added
            if (
              resjson.statusCode === 200 &&
              resjson.data.image !== null &&
              resjson.data.image.height > 1
            ) {
              const website = document.createElement("a");
              const description = document.createElement("p");
              website.className = "infoDiv__website";
              description.className = "infoDiv__description";
              description.innerHTML = `"${resjson.data.description}"`;
              brewImg.style.backgroundImage = `url(${resjson.data.image.url})`;
              website.innerText = h3.innerText;
              website.href = resjson.website_url;
              infoDiv.append(description);
              h3.innerText = "";
              h3.append(website);
            }
          })
          .catch((e) => {
            console.log(`Error: ${e}`);
          });
      }
    });
}
