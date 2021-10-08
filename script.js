// ==== Global Variables ====

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
const favoritesSection = document.querySelector(".favorites");
const favorites__container = document.querySelector(".favorites__container");
const favorites__nothing = document.querySelector(".favorites__nothing");
const mapDiv = document.querySelector(".map");
let mapItems = [];

// Credit to Benece Boros on unsplash for the photo!
const beerStockPhoto =
  "https://images.unsplash.com/photo-1535958636474-b021ee887b13?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80";
let pageCounter;

// ==== Google Maps Javascript API (dynamic loading) ====

// Create the script tag, set the appropriate attributes
const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${config.googleKey}&callback=initMap`;
script.async = true;

// Attach your callback function to the `window` object
window.initMap = function () {
  // JS API is loaded and available
};

// Append the 'script' element to 'head'
document.head.appendChild(script);

if (Object.keys(localStorage).length > 0) {
  favorites__nothing.style.display = "none";
}

// Function initMap renders a map on the "Search Results" section
const initMap = (latitude, longitude, array) => {
  // Options sets the default behaviors of the rendered map
  const options = {
    // Center takes the latitude and longitude parameters and sets them as the initial center of the map
    // When initMap is called back the first brewery search result's lat + lng is used for center
    center: { lat: latitude, lng: longitude },
    // Zoom sets the default map zoom
    zoom: 12,
  };
  // Renders the map onto the map div in index.html with the settings set by the options variable
  map = new google.maps.Map(mapDiv, options);

  // Loops through the array parameter and creates a pin for each coordinate
  for (let i = 0; i < array.length; i++) {
    const marker = addMarker(
      Number(array[i].latitude),
      Number(array[i].longitude)
    );
    const detailWindow = addDetailWindow(array[i].name);
    marker.addListener("mouseover", () => {
      detailWindow.open(map, marker);
    });
    marker.addListener("mouseout", () => {
      detailWindow.close(map, marker);
    });
  }
};

// Function that creates a marker based on latitude and longitude
// Callback is used in initMap
const addMarker = (lat, lng) => {
  return (marker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map,
  }));
};

// Function that assigns text/content to each map pin
// Callback is used in initMap
const addDetailWindow = (content) => {
  return new google.maps.InfoWindow({
    content: `<h2>${content}</h2>`,
  });
};

// ==== Favorites ====

// Pseudocode (Logic is spread throughout the page):
// Everytime a brewery heartIcon is clicked, that brewery is added to localStorage:
// A favorites button is created when each brewery search div is rendered
// Each favorites button is assigned the brewery name as their value
// There is an EventListener that awaits for a click
// When clicked the brewery name is saved into localStorage
// Whenever we go to our homepage, the favorites section fetches info from openbreweryDB
// The values in localStorage are looped through and rendered onto the favorites section
// A delete btn is created when each favorited brewery is created
// There is an EventListener when clicked will localStorage.removeItem(name)

for (let i = 0; i < localStorage.length; i++) {
  fetch(domain + "/" + Object.keys(localStorage)[i])
    .then((res) => {
      return res.json();
    })
    .then((resjson) => {
      const searchDiv = document.createElement("div");
      const infoDiv = document.createElement("div");
      const p = document.createElement("p");
      const h3 = document.createElement("h3");
      const brewImg = document.createElement("div");
      const trashIcon = document.createElement("span");
      infoDiv.className = "infoDiv";
      searchDiv.className = "searchDiv";
      brewImg.className = "brewImg";
      brewImg.style.backgroundImage = `url(${beerStockPhoto})`;
      trashIcon.innerText = "delete";
      trashIcon.classList.add("material-icons", "brewImg__trashIcon");
      trashIcon.value = resjson.id;
      h3.className = "infoDiv__H3";
      h3.innerText = resjson.name;
      p.innerHTML = `${resjson.brewery_type} in ${resjson.city}, ${resjson.state}`;
      p.style.textTransform = "capitalize";
      favorites__container.append(searchDiv);
      searchDiv.append(brewImg, infoDiv);
      brewImg.append(trashIcon);
      infoDiv.append(h3, p);
      // EventListener which removes the target localStorage value then refreshes the page
      trashIcon.addEventListener("click", () => {
        const trashValue = trashIcon.value;
        localStorage.removeItem(trashValue);
        location.reload();
      });
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
      // If the fetched data from openbreweryDB has a website link then we are able to make a fetch request to the microlink API in order to get and add more information into the search item
      if (resjson.website_url) {
        // Fetches website data using the microlink API
        fetch(microlinkDomain + resjson.website_url)
          .then((res) => {
            return res.json();
          })
          .then((resjson) => {
            // Check if the statuscode of the website is 200 and if so then the website is added
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

// ==== Brewery Search ====

// When the submit button is press the innerHtml of the searchcontainer will be cleared if there is any
// a fetch request will then be sent and then the searchContainer will populate with the search query
submitButton.addEventListener("click", (ev) => {
  // The mapItems array is cleared every search and will later contain all the coordinates to generate the map markers
  mapItems = [];
  // Throughout this code block there are updates to the styling of elements in order to dynamically change the page without having to create a separate HTML file
  mapDiv.style.display = "block";
  favoritesSection.style.display = "none";
  loadingContainer.style.display = "flex";
  // Hides the loading icon after 2 seconds
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
  // If the submit value is left blank or current location is typed in then the geolocation API is fetched and the visitor's current longitude and latitude is used to generate the search
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
          "&per_page=12";
        fetchBrewData(search);
      })
      .catch((e) => {
        console.log(`Error: ${e}`);
      });
  } else {
    const search = domain + "?by_city=" + submitValue + "&per_page=12";
    fetchBrewData(search);
  }
});

// Function fetchData is used to send the specified API request, also contains domUpdate in order to update the DOM content
const fetchBrewData = (domain) =>
  fetch(domain)
    .then((res) => {
      return res.json();
    })
    .then((resjson) => {
      domUpdate(resjson);
      // Loops through resjson to check which breweries have a latitude
      for (let i = 0; i < resjson.length; i++) {
        if (resjson[i].latitude !== null) {
          // Pushes all breweries with latitude into mapItems array
          mapItems.push({
            name: resjson[i].name,
            latitude: resjson[i].latitude,
            longitude: resjson[i].longitude,
          });
        }
      }
      console.log(mapItems);
      initMap(
        Number(mapItems[0].latitude),
        Number(mapItems[0].longitude),
        mapItems
      );
      // If API content that comes back is greater than 10, then the nextBtn and prevBtn allow to dynamically look through the search results in multiple pages
      if (resjson.length > 10) {
        // Adds the prevBtn and nextBtn elements onto the page
        const prevBtn = document.createElement("button");
        const nextBtn = document.createElement("button");
        prevBtn.innerHTML = `<span class="material-icons">chevron_left</span>`;
        nextBtn.innerHTML = `<span class="material-icons">chevron_right</span>`;
        prevBtn.className = "previous";
        nextBtn.className = "next";
        pageBtns.append(prevBtn, nextBtn);
        nextBtn.style.display = "block";

        // nextBtn eventListener
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

        //prevBtn eventListener
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

// Function domElCreate is used to specify what will be created inside domUpdate
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
  // Checks localStorage to see if that brewery item already has been liked and if so turns the heart red
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
  // EventListener which either removes the brewery from the localStorage if the heart is red, else the brewery is added to localStorage and the heart becomes red
  heartIcon.addEventListener("click", () => {
    const heartValue = heartIcon.value;
    if (heartIcon.style.color == "red") {
      localStorage.removeItem(heartValue);
      heartIcon.style.color = "white";
    } else {
      localStorage.setItem(heartValue, heartValue);
      heartIcon.style.color = "red";
    }
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
    // Fetches website data using the microlink API
    fetch(microlinkDomain + data[num].website_url)
      .then((res) => {
        return res.json();
      })
      .then((resjson) => {
        // Checks if the statuscode of the website is 200 and if so then the website is added
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

// Function domUpdate is used to update the dom with the fetched API data
// There is an if else statement created in order to not overcrowd the page >> limiting the amount of searched to 10 per page
// There will be a feature to go to either load more or go to the next page
// Also updates the tempHolder array for if the fetch data returns with more than 10 items
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

// Function to format each phone number input
// I made this because I hated how the data retrieves raw numbers without the () or -
const formatPhone = (str) => {
  const results = str.split("");
  results.splice(0, 0, "(");
  results.splice(4, 0, ") ");
  results.splice(8, 0, "-");
  return results.join("");
};
