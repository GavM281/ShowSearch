const form = document.querySelector('#searchForm')
form.addEventListener('submit', async function (e){
    e.preventDefault()
    const searchTerm = form[0].value; // Get search from form
    const config = {params: {q: searchTerm}} // Make query into object
    const res = await axios.get('https://api.tvmaze.com/search/shows', config);

    console.log(res.data)
    showResults(res.data)

    form[0].value = ""; // Empty search bar
})

const getEpisodes = async(id) => {
    try {
        const res = await axios.get('https://api.tvmaze.com/shows/' + id + '/episodes');

        console.log("Going to print from inside getEpisodes");
        console.log(res.data);
        console.log();
        return res.data;

    }catch (e) {
        console.log("error: " + e)
    }
}

// const showResults = (shows) => {
async function showResults(shows){

    const numShows = shows.length;
    console.log(numShows)
    const cards = document.getElementById("results")
    let card = ``;

    for(let result of shows) { // Loop through shows
        console.log()
        console.log(result.show.name)



        console.log("id is " + result.show.id)
        // let episodes = getEpisodes(result.show.id); // Get number of episodes

        getEpisodes(result.show.id).then(showEpisodes => {
            console.log("EPISODE DATA IS   " + showEpisodes)

            let image = ''
            // Show might not have an image
            try {
                if (result.show.image.medium) {
                    image = result.show.image.medium
                } else if (result.show.image.orginal) {
                    image = result.show.image.orginal;
                }
            } catch (e) {
                console.log("error: " + e)
            }

            let numEpisodes = showEpisodes.length; // Number of episodes
            let seasons = showEpisodes[numEpisodes - 1].season;
            console.log("Number of seasons: " + seasons)


            let summary = result.show.summary;
            if(summary.length > 300){ // Limit length of summary if it's too long
                summary = summary.substring(0,300) + '.....'
            }

            let rating = result.show.rating.average;
            if(!rating){
                rating = 'N/A'
            }
            let IMDbId = result.show.externals.imdb;


            // Create a card for a result
            card += `
            <div class="col-sm-6 col-md-4">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-xl-5">
                                <img src="${image}">
                            </div>
                            
                            <div class="col-lg-12 col-xl-7">
                                <h3>${result.show.name}</h3>
                                <p id="review"><i class="fas fa-star icon"></i> ${rating}</p>
                                <p>${seasons} Seasons · ${numEpisodes} episodes</p>
            
            
                                <p>${summary}</p>
                            </div>
                            
                            <a href='https://www.imdb.com/title/${IMDbId}'><button class="btn btn-primary"> See on IMDb.com</button></a>
                        </div>
                    </div>
                </div>
            </div>`
            cards.innerHTML = card;
        })
    }
}