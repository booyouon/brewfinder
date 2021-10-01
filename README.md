# brewfinder

[Live Link Here]

## Project Description

Brew

## API and Data Sample

https://spoonacular.com/food-api

```
{
            "id": 511728,
            "title": "Pasta Margherita",
            "image": "https://spoonacular.com/recipeImages/511728-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 654812,
            "title": "Pasta and Seafood",
            "image": "https://spoonacular.com/recipeImages/654812-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 654857,
            "title": "Pasta On The Border",
            "image": "https://spoonacular.com/recipeImages/654857-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 654883,
            "title": "Pasta Vegetable Soup",
            "image": "https://spoonacular.com/recipeImages/654883-312x231.jpg",
            "imageType": "jpg"

```

## Wireframes

https://whimsical.com/astrofoodie-J5KMjQ1fMGYQEVdJmxXXnJ@2Ux7TurymNCH1EJSmjBe

### MVP/PostMVP

### MVP

- Find and incorporate a food api
- Render astrological data to the page within a dropdown menu
- Build layout using HTML and Javascript
- Style page using Flexbox and CSS
- Add a breakpoint/media query to implement responsive design for a mobile device

#### PostMVP

- Add second round of food to randomize the option for each astrological sign
- Add animations

## Project Schedule

| Day         | Deliverable                                        | Status     |
| ----------- | -------------------------------------------------- | ---------- |
| April 16-18 | Prompt / Wireframes / Priority Matrix / Timeframes | Complete   |
| April 19    | Project Approval/Psuedocode                        | Complete   |
| April 20    | Core Application Structure (HTML, CSS, etc.)       | Complete   |
| April 20    | Actual code                                        | Complete   |
| April 21    | Initial Clickable Model                            | Complete   |
| April 22    | MVP                                                | Complete   |
| April 23    | Presentations                                      | Incomplete |

## Priority Matrix

https://www.figma.com/file/Tzm5yMXuLEeAF1bd6WWnpO/Astrological-Foodie?node-id=0%3A1

## Timeframes

| Component                                    | Priority | Estimated Time | Time Invested | Actual Time |
| -------------------------------------------- | :------: | :------------: | :-----------: | :---------: |
| Pseudocode Javascript                        |    H     |      3 hr      |     2hrs      |    2hrs     |
| HTML and Javascript Structure                |    H     |     6 hrs      |    10 hrs     |   10 hrs    |
| Add/test axios API call                      |    H     |     3 hrs      |     4 hrs     |    4 hrs    |
| Adding clickable buttons and Event Listeners |    H     |     3 hrs      |     3hrs      |    3hrs     |
| Incorporating Flexbox                        |    H     |     3 hrs      |     3hrs      |    3hrs     |
| Styling page with CSS                        |    H     |     5 hrs      |     6hrs      |    6hrs     |
| Pulling Appropriate data from API            |    H     |     4 hrs      |     5 hrs     |    5 hrs    |
| Setting and Styling Media Queries            |    H     |     3 hrs      |     1 hrs     |    1 hrs    |
| Styling Background Image                     |    H     |     3 hrs      |     1hrs      |    1hrs     |
| Total                                        |    H     |     33 hrs     |    36 hrs     |   36 hrs    |

## Code Snippet

This is the code where I was able to render my own data/ descriptions that tied together the food api to each astrological sign. Out of all the code this one was the most challenging because not only did we not go over how todo this, I had to create and append data for all 12 signs in the right order in conjunction to the api and try to keep it dynamic as well.

```
const signDes = foodExplain.find((sign) => {
    console.log(sign.id)
    console.log(foodBtn)
    return sign.id === foodBtn
  })

```

## Change Log

I ended up changing my drop down menu to better be able to append the data to each selection. The first one was cuter but the second was way more functional.
