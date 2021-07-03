/*
	HW6 CSCI571 Due Mar 8 @ 11:59PM/2359
	Andrew M. Calhoun
	USC ID: 4458531648
	email: amcalhou@usc.edu
*/

var API_BASE =  location.hostname;
console.log(location.hostname)
if(location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    API_BASE = 'http://' + API_BASE + ':5000'; // because we need the port for local, azure seems to handle it well enough on its own.
    console.log(API_BASE);
} else {
    API_BASE = 'https://' + API_BASE;

}

const BKD_BASIS = 'https://image.tmdb.org/t/p/w780'
const PSTPRO_BASIS = 'https://image.tmdb.org/t/p/w185'
const movie_url = `${API_BASE}/trending/movie`;
const today_tv_url = `${API_BASE}/tv/airing`;
const tv_genre_url = `${API_BASE}/tv/genre`
const movie_genre_url = `${API_BASE}/movie/genre`

var trending_movies, tv_today, movie_genres, tv_genres, popup;

window.onclick = function(event) {
        if(event.target == popup) {
        popup.style.display = "none";
    }
}

async function loadSite() {
    var tablinks = document.getElementsByClassName('tabs_links');
    tablinks[0].className += " active";

    trending_movies = await simpleFetchMedia(movie_url).then(data => {
        return data;
    });

    tv_today = await simpleFetchMedia(today_tv_url).then(data => {
        return data;
    });
    
    movie_genres = await simpleFetchGenres(movie_genre_url).then(data => {
        return data['genres'];
    });

    tv_genres = await simpleFetchGenres(tv_genre_url).then(data => {
        return data['genres'];
    });

    getTrending();
}

function openTab(evt, tabName) {

      // Declare all variables
    var tabcontent, tablinks, query, category;
    
    if(tabName == 'search') {
        category = document.getElementById('category').value = '';
        query = document.getElementById('keyword').value = '';
        
        document.getElementById('search_results').innerHTML = '';
    }
    

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabContent");
    [].forEach.call(tabcontent, element => {
        element.style.display = "None";
    });

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tabs_links");
    [].forEach.call(tablinks, element => { 
        element.className = element.className.replace("active", "");
    });


    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    }

    // we will get this to load ON page start, but let's just see what we get for now...



async function getTrending() {
    // declare the variables again
    var movieHtml = document.getElementById('trending_movies');
    var tvHtml = document.getElementById('today_tv');
    movieHtml.innerHTML = '';
    tvHtml.innerHTML = '';

    

    movie_release_year = trending_movies[0]['release_date'].substring(0,4);
    tv_release_year = tv_today[0]['first_air_date'].substring(0,4);
    movieHtml.style=`background-image: url(${BKD_BASIS}${trending_movies[0]['backdrop_path']})`
    movieHtml.innerHTML = `<p class="marquee">${trending_movies[0]['title']} (${movie_release_year})<br/></p>`;
    tvHtml.style=`background-image: url(${BKD_BASIS}${tv_today[0]['backdrop_path']})`
    tvHtml.innerHTML = `<p class="marquee">${tv_today[0]['name']} (${tv_release_year})<br/></p>`;

    var i = 1;

    var trending_interval = setInterval(() => {
        if(i == 5) {
            i = 0;
        }

        movie_release_year = trending_movies[i]['release_date'].substring(0,4);
        tv_release_year = tv_today[i]['first_air_date'].substring(0,4);
        // movie
        movieHtml.style=`background-image: url(${BKD_BASIS}${trending_movies[i]['backdrop_path']})`
        movieHtml.innerHTML = `<p class="marquee">${trending_movies[i]['title']} (${movie_release_year})<br/></p>`;
        // tv side
        tvHtml.style=`background-image: url(${BKD_BASIS}${tv_today[i]['backdrop_path']})`
        tvHtml.innerHTML = `<p class="marquee">${tv_today[i]['name']} (${tv_release_year})<br/></p>`;
        
        i++;
    }, 3000);    
    
}

async function getSearch()
{

    var year_of_release, title, genreString, media;
    var results = document.getElementById('search_results');
    results.innerHTML = "";

    validated = Validate();
    if(validated) {

        var category = document.getElementById('category').value;
        var query = document.getElementById('keyword').value;
        
        build_url = `${API_BASE}/${category}/${query}`;

        let search_results = await simpleFetchMedia(build_url, 10).then(response => {
            return response
        });

        if(search_results.length < 1) {
            results.innerHTML = `
            <div id="no_results">
            <h3>Sorry, no results found.</h3>
            </div>`
        } else {

            results.innerHTML = `<h3>Showing results...</h3>`

            search_results.forEach(sr => {
        
                if(category === 'movie') {
                    year_of_release = sr['release_date'].substring(0,4) || 'N/A';
                    title = sr['title'];
                    genreString = processGenresBasedOnId(sr['genre_ids'], movie_genres);
                    media = 'movie';
                }

                if(category === 'tv') {
                    year_of_release = sr['first_air_date'].substring(0, 4) || 'N/A';
                    title = sr['name'];
                    genreString = processGenresBasedOnId(sr['genre_ids'], tv_genres);
                    media = 'tv';
                }
                if(category === 'multi') {
                    if(sr['media_type'] === 'tv') {
                        year_of_release = sr['first_air_date'].substring(0, 4) || 'N/A';
                        title = sr['name'];
                        genreString = processGenresBasedOnId(sr['genre_ids'], tv_genres);
                        media = 'tv';
                    } else {
                        year_of_release = sr['release_date'].substring(0,4) || 'N/A';
                        title = sr['title'];
                        genreString = processGenresBasedOnId(sr['genre_ids'], movie_genres);
                        media = 'movie'
                    }
                };

                var half_rate = (sr['vote_average'] / 2)
                var poster = '';
                if(sr['poster_path']) {
                    poster = PSTPRO_BASIS + sr['poster_path']
                } else {
                    poster = 'static/images/movie_placeholder.png';
                }


                results.innerHTML += `
                <div class="search_results_container">
                                        <div class="search_results_poster"><img style="width: 185px;" src="${poster}"></div>
                                        <div class="search_results_info"><h2>${title}</h2>
                                                                            <p> ${year_of_release} | ${genreString}</p>
                                                                            <span class="highlight">&starf; ${half_rate} / 5</span> &nbsp;&nbsp;${sr['vote_count']} votes<br/>
                                                                            <p class="overview">${sr['overview']}</p>
                                                                            <br/>
                                                                            <button class="show_more" onClick="generatePopup(${sr['id']}, '${media}')">Show More</button>
                                        </div>
                                    </div>`
            });
        }
    }
}


function Validate() {
        if (document.getElementById('keyword').value == "" && document.getElementById('category').value == "") {
            alert('Input required for keyword search and category.');
            return false;
        }

        if (document.getElementById('category').value == "") {
            alert('Input required for category.');
            return false;
        }
        
        else if (document.getElementById('keyword').value == "") {
            alert('Input required for keyword search.');
            return false;
        }
        else {
            return true;
        }
}

function clearForm() {
    document.getElementById('keyword').value = ''
    document.getElementById('category').value = '';
    document.getElementById('search_results').innerHTML = '';

}

// Yea. See if we can make this agnostic...
function processGenresBasedOnId(item, genres) {
    if(item.length < 1) {
        return 'N/A';
    }
    var genre_string = ''

    for(var i = 0; i < item.length; i++) {
         for(var j = 0; j < genres.length; j++) {
            if(item[i] == genres[j]['id']) {
                 genre_string += genres[j]['name'];
                 if(i != item.length - 1) {
                     genre_string += ', '
                 }
            }
        }
    }    
    return genre_string; 
}

async function generatePopup(id, media) {
    popup = document.getElementById("media_cover");
    var details, cast, reviews;
    
    details_url = `${API_BASE}/${media}/details/${id}`
    cast_url = `${API_BASE}/${media}/credits/${id}`
    reviews_url = `${API_BASE}/${media}/reviews/${id}`



    let details_response = await fetch(details_url);   
    if(details_response.ok) {
        details = await details_response.json();
    } else {
        alert(`${id} not found for ${category}. Try a different category or again at a later time`);
    }

    let cast_response = await fetch(cast_url);
    if(cast_response.ok) {
        cast = await cast_response.json();
    } else {
        alert(`${id} not found for ${category}. Try a different category or again at a later time`);
    }

    let reviews_response = await fetch(reviews_url);
    if(reviews_response.ok) {
        reviews = await reviews_response.json();    
    } else {
        alert(`${id} not found for ${category}. Try a different category or again at a later time`);
    }

    parseDetails(details, id, media);
    parseCast(cast['cast'].slice(0,8))
    parseReviews(reviews['results'].slice(0,5));

    popup.style.display = "block";
}

function parseDetails(details, id, media='movie') {
    var spoken_languages = '' 
    var genreString = '';
    let details_element = document.getElementById('media_details');
    
    if(media === 'movie') {
        title = details['title'];
        year_of_release = (details['release_date']) ? details['release_date'].substring(0,4) : 'N/A';
    } else {
        title = details['name'];
        year_of_release = (details['first_air_date']) ? details['first_air_date'].substring(0,4) : 'N/A';
    }

    if(details['backdrop_path']) {
        backdrop_path = BKD_BASIS + details['backdrop_path'];
    } else {
        backdrop_path = 'static/images/movie-placeholder.jpg';
    }
    
    details['genres'].forEach(genre => {
        genreString += `${genre['name']}, `;
    });
    genreString = genreString.slice(0, genreString.length-2).trim() || 'N/A';
    
    details['spoken_languages'].forEach(language => {
        spoken_languages += `${language['english_name']}, `;
    });

    // this is a really cheeky way to do this, so I'm just gonna have some fun :)
    spoken_languages = spoken_languages.slice(0, spoken_languages.length-2).trim();
    console.log(spoken_languages);
    if(spoken_languages == '') {
        spoken_languages = 'N/A';
    }

    details_element.innerHTML = `
    <img style="margin-left: 50px;" src="${backdrop_path}">
    <h2>${title}  &Tab; <a class="highlight" href="https://www.themoviedb.org/movie/${id}" target="_blank"> <span style="font-size: 18px"> &#x1F6C8; </span></a></h2>
    <h3>${year_of_release} | ${genreString}</h3>
    <p><span class="highlight">&starf; ${details['vote_average'] / 2} / 5</span> &nbsp; <span style="vertical-align: super; font-size:16px;">${details['vote_count']} votes</span></p>
    <p>${details['overview']}</p>
    <p><b>Spoken Languages:</b> <i>${spoken_languages}</i></p>
    `;   

    
}

function parseCast(cast) {
    cast_element = document.getElementById('media_cast');

    cast_element.innerHTML = `<h2>Cast</h2>`

    if(cast.length < 1) {
        cast_element.innerHTML += `<h3>N/A</h3>`
    }
   
    cast.forEach(member => {
        var headshot = (member['profile_path']) ? PSTPRO_BASIS + member['profile_path'] : 'static/images/person-placeholder.png';
        cast_element.innerHTML += `<div class="actor_box">
            <img src="${headshot}"><br/>
            <p class="review"><b>${member['name']}</b><br/> as <br/> ${member['character'] || 'Character Unknown'}</p>
        </div>`

        });    
}

function parseReviews(reviews) {


    let review_element = document.getElementById('media_reviews');
    review_element.innerHTML = "<h2>Reviews</h2>"

    if(reviews.length < 1) {
        review_element.innerHTML += "<h3>N/A</h3>"
        return;
    }
    
    reviews.forEach(review => {

        var refactor_date = processDate(review['created_at'])
        vote_count = (review['author_details']['rating'] != null) ? `<p><span class="highlight">&starf; ${review['author_details']['rating'] / 2} / 5</span></p>` : ''
        console.log(vote_count);

        review_element.innerHTML += `
        <div class="review_container">
        <p><b>${review['author']}</b> on ${refactor_date}</p>
        ${vote_count}
        <p class="review">${review['content']}</p>
        <hr /></div>`        
    });
}

async function simpleFetchMedia(url, slice = 5)
{
    let response = await fetch(url, {
        method: 'GET', 
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    if(response.ok) {
        let json = await response.json();
        return json['results'].slice(0, slice);
    } else {
        alert('There may have been an issue. Please check the error and try again. RESPONSE: ' + response.status);
    }
}

async function simpleFetchGenres(url)
{
    let response = await fetch(url, {
        method: 'GET', 
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    if(response.ok) {
        return await response.json();
        
    } else {
        alert('There may have been an issue. Please check the error and try again. RESPONSE: ' + response.status);
    }
}

function processDate(date)
{
    return `${date.substring(0,4)}/${date.substring(5,7)}/${date.substring(8,10)}`;
}

function closePopup()
{
    document.getElementById('media_cover').style.display = 'none';
}