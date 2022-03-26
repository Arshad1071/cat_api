const apiKey = 'a5dd87d3-b62c-496d-a62f-c69e4b5560de';
const imageDispalyElement = document.getElementById("list");
let breedList = document.getElementById("breeds");
let categoriesList = document.getElementById("categories");
let formData = document.getElementById("myForm");





class catApi {

    constructor(imageDispalyElement) {
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
                    breedList.add(option);
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
                    categoriesList.add(option);
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }



    DisplayList(items, wrapper, rowsPerPage, page) {
        wrapper.innerHTML = "";
        page--;
        let start = rowsPerPage * page;
        let end = start + rowsPerPage;
        let paginatedItms = items.slice(start, end);
        for (let i = 0; i < paginatedItms.length; i++) {
            console.log(items[i])
            let item = paginatedItms[i];
            let img = document.createElement('img');
            img.src = item;
            wrapper.appendChild(img);
        }
    }

}

const catApiOne = new catApi(imageDispalyElement);



// Event Listener to form
formData.addEventListener("submit", (e) => {

    e.preventDefault();

    let category = formData.elements.namedItem("categories").value;
    let breed = formData.elements.namedItem("breeds").value;
    let order = formData.elements.namedItem("order").value;
    let type = formData.elements.namedItem("type").value;
    let limit = formData.elements.namedItem('limit').value;

    fetch(`https://api.thecatapi.com/v1/images/search?limit=${limit}&category_ids=${category}&breed=${breed}&size=full&order=${order}&mime_types=${type}`, {
        method: 'get',
        headers: {
            "x-api-key": apiKey
        },
    })
        .then(response => response.json())
        .then(response => {
            let items = [];
            response.forEach(itme => items.push(itme.url))
            catApiOne.DisplayList(items, imageDispalyElement, 9, 1);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

















