const apiKey = 'a5dd87d3-b62c-496d-a62f-c69e4b5560de';
const imageDispalyElement = document.getElementById("list");
let breedList = document.getElementById("breeds");
let categoriesList = document.getElementById("categories");
let formData = document.getElementById("myForm");
let paginationButtons = document.getElementById("pagination");

class catApi {

    constructor(imageDispalyElement, breed, category) {
        this.imageDispalyElement;

        //Fetching breeds
        fetch('https://api.thecatapi.com/v1/breeds', {
                method: 'get',
                headers: {
                    "x-api-key": apiKey
                },
            })
            .then(response => response.json())
            .then(response => {
                response.forEach(itme => {
                    let option = document.createElement("option");
                    option.text = itme.id;
                    breed.add(option);
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });


        //Fetching categories
        fetch('https://api.thecatapi.com/v1/categories', {
                method: 'get',
                headers: {
                    "x-api-key": apiKey
                },
            })
            .then(response => response.json())
            .then(response => {
                response.forEach(itme => {
                    let option = document.createElement("option");
                    option.text = itme.name;
                    option.value = itme.id;
                    category.add(option);
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    DisplayList(items, wrapper) {
        wrapper.innerHTML = "";
        for (let i = 0; i < items.length; i++) {
            let img = document.createElement('img');
            img.src = items[i];
            wrapper.appendChild(img);
        }
    }


    setPagiantionButtons(currentPage, totalPage) {

        paginationButtons.innerHTML = "";
        let previusBtn = document.createElement('li');
        let spanStart = document.createElement("span");
        spanStart.className = "page-link";
        spanStart.innerText = "<<";
        previusBtn.className = "page-item";
        previusBtn.appendChild(spanStart);
        paginationButtons.appendChild(previusBtn);

        let btn = document.createElement('li');
        let aTag = document.createElement('a');
        let currentPageSpan = document.createElement("span");
        aTag.className = "page-link";
        btn.className = "page-item";
        currentPageSpan.className = "sr-only";
        btn.appendChild(aTag);
        aTag.appendChild(currentPageSpan);
        aTag.innerText = currentPage;
        aTag.style.background = "#00ff6c";
        paginationButtons.appendChild(btn);

        let nextBtn = document.createElement('li');
        let spanEnd = document.createElement("span");
        spanEnd.className = "page-link";
        spanEnd.innerText = ">>";
        nextBtn.className = "page-item";
        nextBtn.appendChild(spanEnd);
        paginationButtons.appendChild(nextBtn);

        nextBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (currentPage < totalPage) {
                currentPage++;
                catApiOne.getImages(currentPage);
            } else {
                alert("Maximum pages avilable for this selection is " + totalPage);
            }


        })

        previusBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                catApiOne.getImages(currentPage);
            } else {
                alert("Page count is starts from 1");
            }

        })
    }

    getImages(pageCount) {

        let category = formData.elements.namedItem("categories").value;
        let breed = formData.elements.namedItem("breeds").value;
        let order = formData.elements.namedItem("order").value;
        let type = formData.elements.namedItem("type").value;
        let limit = formData.elements.namedItem('limit').value;


        fetch(`https://api.thecatapi.com/v1/images/search?limit=${limit}&category_ids=${category}&breed=${breed}&size=full&order=${order}&mime_types=${type}&page=${pageCount}`, {
                method: 'get',
                headers: {
                    "x-api-key": apiKey,
                },
            })
            .then(response => response.json())
            .then(response => {
                let items = [];
                response.forEach(itme => {
                    items.push(itme.url);
                });
                catApiOne.DisplayList(items, imageDispalyElement);
            })
            .catch((error) => {
                console.error('Error:', error);
            });


        fetch(`https://api.thecatapi.com/v1/images/search?limit=${limit}&category_ids=${category}&breed=${breed}&size=full&order=${order}&mime_types=${type}`, {
                method: 'get',
                headers: {
                    "x-api-key": apiKey,
                },
            })
            .then(response => {
                let totalPage = parseInt(response.headers.get("pagination-count") / limit);
                console.log("Total page", totalPage);;
                console.log("Current page", pageCount);
                catApiOne.setPagiantionButtons(pageCount, totalPage);
            })
            .catch((error) => {
                console.error('Error:', error);
            });


    }
}

const catApiOne = new catApi(imageDispalyElement, breedList, categoriesList);

// Event Listener to form
formData.addEventListener("submit", (e) => {
    e.preventDefault();
    catApiOne.getImages(1);
});