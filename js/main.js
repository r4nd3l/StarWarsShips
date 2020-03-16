function clean(obj) {
    for (var propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
            delete obj[propName];
        }
    }
}

function getStar(i, mai) {
    if (i == mai) {
        return "&#11088;"
    }
    else {
        return " ";
    }
}

function getStarWarsStarpships(progress, url = 'https://swapi.co/api/starships/?format=json', starships = []) {
    return new Promise((resolve, reject) => fetch(url)
        .then(response => {
            if (response.status !== 200) {
                throw `${response.status}: ${response.statusText}`;
            }
            response.json().then(data => {
                starships = starships.concat(data.results);

                if (data.next) {
                    progress && progress(starships);
                    getStarWarsStarpships(progress, data.next, starships).then(resolve).catch(reject)
                } else {
                    resolve(starships);
                }
            }).catch(reject);
        }).catch(reject));
}

function progressCallback(starships) {
    //console.log(`${starships.length} loaded`);
}

getStarWarsStarpships(progressCallback)
    .then(starships => {

        starships.forEach(element => {
            delete element.manufacturer
            delete element.cost_in_credits
            delete element.length
            delete element.max_atmosphering_speed
            delete element.cargo_capacity
            delete element.consumables
            delete element.hyperdrive_rating
            delete element.MGLT
            delete element.starship_class
            delete element.pilots
            delete element.created
            delete element.edited
            delete element.url

            element.films_count = element.films.length

            element.films.forEach((film, index) => {
                fetch(film)
                    .then(response => {
                        if (response.status !== 200) {
                            throw `${response.status}: ${response.statusText}`;
                        }
                        return response.json()
                    }).then(data => {
                        delete data.episode_id
                        delete data.opening_crawl
                        delete data.producer
                        delete data.characters
                        delete data.planets
                        delete data.starships
                        delete data.vehicles
                        delete data.species
                        delete data.created
                        delete data.edited
                        delete data.url

                        element.films[index] = data
                    })
            })
        });

        newStarships = { count: "0", results: "[]" };
        var obj = JSON.stringify(newStarships)
        var obj = JSON.parse(obj)
        obj.count = starships.length
        obj.results = starships

        obj.results.sort((a, b) => a.crew - b.crew)

        obj.results.forEach((o, index) => {
            if (o.crew < 10) {
                delete obj.results[index]
            }
        })

        //  clean(obj.results)
        //obj.keys(oj).forEach(k => (!o[k] && o[k] !== undefined) && delete o[k]);

        appearedMostIndex = 0
        appeard = 0
        obj.results.forEach((o, index) => {
            if (o.films_count > appeard) {
                appeard = o.films_count
                appearedMostIndex = index
            }
        })


        //console.log(Math.max.apply(Math, obj.results.map(function (o) { return parseInt(o.films_count); })))

        obj.results.forEach((o, i) => {
            if (o != null || o != undefined || o != "") {

                document.getElementById("x").innerHTML += `
                    <div class="card">
                    <div class="content">
                        <h2>${o.name} ${getStar(i, appearedMostIndex)}<br>
                        <span>${o.model}</span>
                        </h2>
                        <hr>
                        <ul>
                        <li>
                            <h2>${o.crew}</h2>
                            <p>Crew</p>
                        </li>
                        <li>
                            <h2>${o.passengers}</h2>
                            <p>Passengers</p>
                        </li>
                        <li>
                            <h2>${o.films_count}</h2>
                            <p>Films</p>
                        </li>
                        </ul>
                    </div>
                    </div>
                `;
            }
        })


        //console.log("Appeared the most films:" + obj.results[appearedMostIndex].name)
        //console.log(starships.map(s => s))
        console.log(obj.results.map(e => e))
        //console.log(JSON.stringify(obj.results))

    })
    .catch(console.error);
