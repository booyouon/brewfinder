# brewfinder

## Project Description

Brew finder is an application used to find breweries based on your search!

## API sample

openbrewerydb:

```json
    {
        "id": 8865,
        "obdb_id": "big-dog-s-brewing-co-las-vegas",
        "name": "Big Dog's Brewing Co",
        "brewery_type": "brewpub",
        "street": "4547 N Rancho Dr Ste A",
        "address_2": null,
        "address_3": null,
        "city": "Las Vegas",
        "state": "Nevada",
        "county_province": null,
        "postal_code": "89130-3432",
        "country": "United States",
        "longitude": null,
        "latitude": null,
        "phone": "7023683715",
        "website_url": "http://www.bigdogsbrews.com",
        "updated_at": "2018-08-11T00:00:00.000Z",
        "created_at": "2018-07-24T00:00:00.000Z"
    },
    {
        "id": 8662,
        "obdb_id": "barrel-dog-brewing-evergreen",
        "name": "Barrel Dog Brewing",
        "brewery_type": "micro",
        "street": null,
        "address_2": null,
        "address_3": null,
        "city": "Evergreen",
        "state": "Colorado",
        "county_province": null,
        "postal_code": "80439",
        "country": "United States",
        "longitude": "-105.321458",
        "latitude": "39.6361637",
        "phone": "5599176846",
        "website_url": null,
        "updated_at": "2018-08-24T00:00:00.000Z",
        "created_at": "2018-07-24T00:00:00.000Z"
    }
```

abstract geolocation:

```json
{
  "ip_address": "166.171.248.255",
  "city": "Modesto",
  "city_geoname_id": 5373900,
  "region": "California",
  "region_iso_code": "CA",
  "region_geoname_id": 5332921,
  "postal_code": "95353",
  "country": "United States",
  "country_code": "US",
  "country_geoname_id": 6252001,
  "country_is_eu": false,
  "continent": "North America",
  "continent_code": "NA",
  "continent_geoname_id": 6255149,
  "longitude": -120.997,
  "latitude": 37.6393,
  "security": {
    "is_vpn": false
  },
  "timezone": {
    "name": "America/Los_Angeles",
    "abbreviation": "PST",
    "gmt_offset": -8,
    "current_time": "07:10:37",
    "is_dst": false
  },
  "flag": {
    "emoji": "🇺🇸",
    "unicode": "U+1F1FA U+1F1F8",
    "png": "https://static.abstractapi.com/country-flags/US_flag.png",
    "svg": "https://static.abstractapi.com/country-flags/US_flag.svg"
  },
  "currency": {
    "currency_name": "USD",
    "currency_code": "USD"
  },
  "connection": {
    "autonomous_system_number": 20057,
    "autonomous_system_organization": "AT&T Mobility LLC",
    "connection_type": "Cellular",
    "isp_name": "AT&T Mobility LLC",
    "organization_name": "Service Provider Corporation"
  }
}
```

microlink:

```json
{
  "status": "success",
  "data": {
    "title": "microlink.io",
    "description": "Turn websites into data. microlink.io has 34 repositories available. Follow their code on GitHub.",
    "lang": "en",
    "author": null,
    "publisher": "GitHub",
    "image": {
      "url": "https://avatars0.githubusercontent.com/u/29799436?s=280&v=4",
      "type": "png",
      "size": 4118,
      "height": 280,
      "width": 280,
      "size_pretty": "4.12 kB"
    },
    "date": "2020-09-22T09:33:36.000Z",
    "url": "https://github.com/microlinkhq",
    "logo": {
      "url": "https://logo.clearbit.com/github.com",
      "type": "png",
      "size": 6313,
      "height": 128,
      "width": 128,
      "size_pretty": "6.31 kB"
    }
  }
}
```

## Wireframes

[Link to wireframe](https://whimsical.com/brew-maps-Jr1K564XSfDG8kh8ktuYPt)

## MVP

- [x] Use an API to populate the search query
- [x] Render the search onto the page
- [x] Responsize style with Flexbox and media queries
- [ ] Deploy Site

## Post-MVP

- [x] Add images to each search
- [x] Use a second API
- [ ] Add a loading animations
- [ ] Use a map API to display the searches
- [ ] Apply CRUD by either adding a reviews page or a way users can add their own breweries

## Project Schedule

| Date   | Description                                           |
| ------ | ----------------------------------------------------- |
| Oct 1  | Readme draft, Project Approval, Wireframes, First API |
| ------ | ----------------------------------------------------- |
| Oct 2  | Project Approval + Pseudocode + Boilerplate           |
| ------ | ----------------------------------------------------- |
| Oct 3  | API set up on Postman + fetch work on JS              |
| ------ | ----------------------------------------------------- |
| Oct 4  | Finish MVP + Misc code + styling + second API         |
| ------ | ----------------------------------------------------- |
| Oct 5  | Third Geo API                                         |
| ------ | ----------------------------------------------------- |
| Oct 6  | Footer + Deployment                                   |
| ------ | ----------------------------------------------------- |
| Oct 7  | Clean up code + Prepare for presentations             |
| ------ | ----------------------------------------------------- |
| Oct 8  | Presentations                                         |
| ------ | ----------------------------------------------------- |

## Code Snippet

I like this piece of code because it is the only piece of code in my project that most closely deals with putting algo's into real world practice which I feel like is kinda cool. What it does though is it formats phone numbers so that they don't look ugly. Does not have anything to do with breweries lol.

```javascript
const formatPhone = (str) => {
  const results = str.split("");
  results.splice(0, 0, "(");
  results.splice(4, 0, ") ");
  results.splice(8, 0, "-");
  return results.join("");
};
```
