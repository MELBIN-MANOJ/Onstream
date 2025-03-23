const API_KEY = 'api_key=67bc3a8942eb1cb931d8ef77bd4bf5bc';
const BASE_URL = 'https://api.themoviedb.org/3';
const MOVIE_API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const TV_API_URL = BASE_URL + '/discover/tv?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const MOVIE_SEARCH_URL = BASE_URL + '/search/movie?'+API_KEY;
const TV_SEARCH_URL = BASE_URL + '/search/tv?'+API_KEY;

// Set default content type
let currentContentType = 'movie'; // Options: 'movie' or 'tv'

// Check if we're on the detail page
const isDetailPage = window.location.pathname.includes('moviedetail.html');

// If we're on the main page, run the main page code
if (!isDetailPage) {
    const genres = [
        {
          "id": 28,
          "name": "Action"
        },
        {
          "id": 12,
          "name": "Adventure"
        },
        {
          "id": 16,
          "name": "Animation"
        },
        {
          "id": 35,
          "name": "Comedy"
        },
        {
          "id": 80,
          "name": "Crime"
        },
        {
          "id": 99,
          "name": "Documentary"
        },
        {
          "id": 18,
          "name": "Drama"
        },
        {
          "id": 10751,
          "name": "Family"
        },
        {
          "id": 14,
          "name": "Fantasy"
        },
        {
          "id": 36,
          "name": "History"
        },
        {
          "id": 27,
          "name": "Horror"
        },
        {
          "id": 10402,
          "name": "Music"
        },
        {
          "id": 9648,
          "name": "Mystery"
        },
        {
          "id": 10749,
          "name": "Romance"
        },
        {
          "id": 878,
          "name": "Science Fiction"
        },
        {
          "id": 10770,
          "name": "TV Movie"
        },
        {
          "id": 53,
          "name": "Thriller"
        },
        {
          "id": 10752,
          "name": "War"
        },
        {
          "id": 37,
          "name": "Western"
        }
    ];
    
    // TV genres from TMDb
    const tvGenres = [
        {
          "id": 10759,
          "name": "Action & Adventure"
        },
        {
          "id": 16,
          "name": "Animation"
        },
        {
          "id": 35,
          "name": "Comedy"
        },
        {
          "id": 80,
          "name": "Crime"
        },
        {
          "id": 99,
          "name": "Documentary"
        },
        {
          "id": 18,
          "name": "Drama"
        },
        {
          "id": 10751,
          "name": "Family"
        },
        {
          "id": 10762,
          "name": "Kids"
        },
        {
          "id": 9648,
          "name": "Mystery"
        },
        {
          "id": 10763,
          "name": "News"
        },
        {
          "id": 10764,
          "name": "Reality"
        },
        {
          "id": 10765,
          "name": "Sci-Fi & Fantasy"
        },
        {
          "id": 10766,
          "name": "Soap"
        },
        {
          "id": 10767,
          "name": "Talk"
        },
        {
          "id": 10768,
          "name": "War & Politics"
        },
        {
          "id": 37,
          "name": "Western"
        }
    ];
    
    const main = document.getElementById('main');
    const form = document.getElementById('form');
    const search = document.getElementById('search');
    const tagsEl = document.getElementById('tags');
    
    // Content type toggle elements
    const contentTypeContainer = document.createElement('div');
    contentTypeContainer.className = 'content-type-toggle';
    document.querySelector('header').appendChild(contentTypeContainer);
    
    // Find the section in your script.js where you create the toggle buttons and replace it with:

// Content type toggle elements - using existing buttons from HTML
const movieToggle = document.getElementById('movie-toggle');
const tvToggle = document.getElementById('tv-toggle');

// Set default content type
let currentContentType = 'movie'; // Options: 'movie' or 'tv'

// Add event listeners to toggle buttons
movieToggle.addEventListener('click', () => switchContentType('movie'));
tvToggle.addEventListener('click', () => switchContentType('tv'));

// Function to switch between content types
function switchContentType(type) {
    currentContentType = type;
    
    // Update active toggle button
    if (type === 'movie') {
        movieToggle.classList.add('active');
        tvToggle.classList.remove('active');
    } else {
        movieToggle.classList.remove('active');
        tvToggle.classList.add('active');
    }
    
    // Reset search and filters
    selectedGenre = [];
    search.value = '';
    
    // Update genre tags based on content type
    setGenre();
    
    // Load appropriate content
    if (type === 'movie') {
        getContent(MOVIE_API_URL);
    } else {
        getContent(TV_API_URL);
    }
}
    
    const prev = document.getElementById('prev')
    const next = document.getElementById('next')
    const current = document.getElementById('current')
    
    var currentPage = 1;
    var nextPage = 2;
    var prevPage = 3;
    var lastUrl = '';
    var totalPages = 100;
    
    var selectedGenre = []
    setGenre();
    
    function setGenre() {
        tagsEl.innerHTML = '';
        
        // Choose the appropriate genre list based on content type
        const activeGenres = currentContentType === 'movie' ? genres : tvGenres;
        
        activeGenres.forEach(genre => {
            const t = document.createElement('div');
            t.classList.add('tag');
            t.id = genre.id;
            t.innerText = genre.name;
            t.addEventListener('click', () => {
                if(selectedGenre.length == 0){
                    selectedGenre.push(genre.id);
                } else {
                    if(selectedGenre.includes(genre.id)){
                        selectedGenre.forEach((id, idx) => {
                            if(id == genre.id){
                                selectedGenre.splice(idx, 1);
                            }
                        })
                    } else {
                        selectedGenre.push(genre.id);
                    }
                }
                console.log(selectedGenre);
                const baseApiUrl = currentContentType === 'movie' ? MOVIE_API_URL : TV_API_URL;
                getContent(baseApiUrl + '&with_genres='+encodeURI(selectedGenre.join(',')))
                highlightSelection()
            })
            tagsEl.append(t);
        })
    }
    
    function highlightSelection() {
        const tags = document.querySelectorAll('.tag');
        tags.forEach(tag => {
            tag.classList.remove('highlight')
        })
        clearBtn()
        if(selectedGenre.length !=0){   
            selectedGenre.forEach(id => {
                const hightlightedTag = document.getElementById(id);
                if (hightlightedTag) { // Check if the tag exists
                    hightlightedTag.classList.add('highlight');
                }
            })
        }
    }
    
    function clearBtn(){
        let clearBtn = document.getElementById('clear');
        if(clearBtn){
            clearBtn.classList.add('highlight')
        } else {
            let clear = document.createElement('div');
            clear.classList.add('tag','highlight');
            clear.id = 'clear';
            clear.innerText = 'Clear x';
            clear.addEventListener('click', () => {
                selectedGenre = [];
                setGenre();
                const baseApiUrl = currentContentType === 'movie' ? MOVIE_API_URL : TV_API_URL;
                getContent(baseApiUrl);
            })
            tagsEl.append(clear);
        }
    }
    
    // Initial content load - start with movies
    getContent(MOVIE_API_URL);
    
    function getContent(url) {
        lastUrl = url;
        fetch(url).then(res => res.json()).then(data => {
            console.log(data.results);
            if(data.results.length !== 0){
                showContent(data.results);
                currentPage = data.page;
                nextPage = currentPage + 1;
                prevPage = currentPage - 1;
                totalPages = data.total_pages;
    
                current.innerText = currentPage;
    
                if(currentPage <= 1){
                    prev.classList.add('disabled');
                    next.classList.remove('disabled')
                } else if(currentPage >= totalPages){
                    prev.classList.remove('disabled');
                    next.classList.add('disabled')
                } else {
                    prev.classList.remove('disabled');
                    next.classList.remove('disabled')
                }
    
                tagsEl.scrollIntoView({behavior : 'smooth'})
            } else {
                main.innerHTML = `<h1 class="no-results">No Results Found</h1>`
            }
        })
    }
    
    function showContent(data) {
        main.innerHTML = '';
    
        data.forEach(item => {
            // Handle both movie and TV show properties
            const title = item.title || item.name;
            const releaseDate = item.release_date || item.first_air_date;
            const {poster_path, vote_average, overview, id} = item;
            
            const contentEl = document.createElement('div');
            contentEl.classList.add('movie'); // Keep the class name for consistency
            contentEl.innerHTML = `
                 <img src="${poster_path ? IMG_URL+poster_path : "http://via.placeholder.com/1080x1580" }" alt="${title}">
    
                <div class="movie-info">
                    <h3>${title}</h3>
                    <span class="${getColor(vote_average)}">${vote_average.toFixed(1)}</span>
                </div>
    
                <div class="overview">
                    <h3>Overview</h3>
                    ${overview}
                    <br/> 
                    <button class="know-more" id="${id}" hidden></button>
                </div>
            `;
            
            // Add click event to the entire card
            contentEl.addEventListener('click', () => {
                console.log(id);
                openNav(item);
            });
    
            main.appendChild(contentEl);
    
            document.getElementById(id).addEventListener('click', () => {
                console.log(id);
                openNav(item);
            });
        });
    }
    
    function openNav(item) {
        let id = item.id;
        const title = item.title || item.name;
        
        // Redirect to detail page with content type parameter
        window.location.href = `moviedetail.html?id=${id}&title=${encodeURIComponent(title)}&type=${currentContentType}`;
    }
    
    function getColor(vote) {
        if(vote >= 8){
            return 'green'
        } else if(vote >= 5){
            return "orange"
        } else {
            return 'red'
        }
    }
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
    
        const searchTerm = search.value;
        selectedGenre = [];
        setGenre();
        
        if(searchTerm) {
            const searchUrl = currentContentType === 'movie' ? MOVIE_SEARCH_URL : TV_SEARCH_URL;
            getContent(searchUrl + '&query=' + searchTerm);
        } else {
            const baseApiUrl = currentContentType === 'movie' ? MOVIE_API_URL : TV_API_URL;
            getContent(baseApiUrl);
        }
    });
    
    prev.addEventListener('click', () => {
        if(prevPage > 0){
            pageCall(prevPage);
        }
    });
    
    next.addEventListener('click', () => {
        if(nextPage <= totalPages){
            pageCall(nextPage);
        }
    });
    
    function pageCall(page){
        let urlSplit = lastUrl.split('?');
        let queryParams = urlSplit[1].split('&');
        let key = queryParams[queryParams.length - 1].split('=');
        if(key[0] != 'page'){
            let url = lastUrl + '&page=' + page
            getContent(url);
        } else {
            key[1] = page.toString();
            let a = key.join('=');
            queryParams[queryParams.length - 1] = a;
            let b = queryParams.join('&');
            let url = urlSplit[0] + '?' + b;
            getContent(url);
        }
    }
} 
// If we're on the detail page, run the detail page code
else {
    // Get DOM elements for the detail page
    const videoContainer = document.getElementById('video-container');
    const titleElement = document.getElementById('movie-title');
    const posterContainer = document.querySelector('.movie-poster-container');
    const infoContainer = document.querySelector('.movie-info-container');
    const castListContainer = document.getElementById('cast-list');
    
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const title = urlParams.get('title');
    const contentType = urlParams.get('type') || 'movie'; // Default to movie if not specified
    
    // Update page title with content type
    document.title = contentType === 'movie' ? 'Movie Details' : 'TV Show Details';
    
    // Set the content title
    if (titleElement) {
        titleElement.textContent = title || (contentType === 'movie' ? 'Movie Details' : 'TV Show Details');
    }
    
    // Load all details when the page loads
    loadDetails();
    
    function loadDetails() {
        if (!id) return;
        
        // Fetch details based on content type
        fetch(`${BASE_URL}/${contentType}/${id}?${API_KEY}&append_to_response=credits`)
            .then(res => res.json())
            .then(data => {
                console.log('Content details:', data);
                
                // Display poster
                if (posterContainer) {
                    posterContainer.innerHTML = `
                        <img src="${data.poster_path ? IMG_URL + data.poster_path : 'http://via.placeholder.com/500x750'}" 
                             alt="${data.title || data.name}" class="movie-poster">
                    `;
                }
                
                // Display info
                if (infoContainer) {
                    // Format release/air date
                    const releaseDate = new Date(data.release_date || data.first_air_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    
                    // Format runtime (different for movies vs TV shows)
                    let runtimeDisplay = '';
                    if (contentType === 'movie') {
                        const hours = Math.floor(data.runtime / 60);
                        const minutes = data.runtime % 60;
                        runtimeDisplay = `${hours}h ${minutes}m`;
                    } else {
                        // For TV shows, show number of seasons and episodes
                        runtimeDisplay = `${data.number_of_seasons || 0} seasons, ${data.number_of_episodes || 0} episodes`;
                        // If episode runtime is available
                        if (data.episode_run_time && data.episode_run_time.length > 0) {
                            runtimeDisplay += ` (avg. ${data.episode_run_time[0]} min per episode)`;
                        }
                    }
                    
                    // Get genres
                    const genres = data.genres.map(genre => genre.name).join(', ');
                    
                    // TV show specific information
                    let tvInfo = '';
                    if (contentType === 'tv') {
                        tvInfo = `
                            <p><strong>Status:</strong> ${data.status}</p>
                            <p><strong>Networks:</strong> ${data.networks?.map(n => n.name).join(', ') || 'N/A'}</p>
                            <p><strong>Next Episode:</strong> ${data.next_episode_to_air ? new Date(data.next_episode_to_air.air_date).toLocaleDateString() : 'N/A'}</p>
                        `;
                    }
                    
                    infoContainer.innerHTML = `
                        <div class="rating">
                            <span class="${getColor(data.vote_average)}">${data.vote_average.toFixed(1)}</span>
                        </div>
                        <div class="movie-metadata">
                            <p><strong>${contentType === 'movie' ? 'Release Date' : 'First Air Date'}:</strong> ${releaseDate}</p>
                            <p><strong>${contentType === 'movie' ? 'Runtime' : 'Episodes'}:</strong> ${runtimeDisplay}</p>
                            <p><strong>Genres:</strong> ${genres}</p>
                            <p><strong>Language:</strong> ${data.original_language.toUpperCase()}</p>
                            ${tvInfo}
                        </div>
                        <div class="movie-overview">
                            <h3>Overview</h3>
                            <p>${data.overview}</p>
                        </div>
                    `;
                }
                
                // Display cast members
                if (castListContainer && data.credits && data.credits.cast) {
                    const cast = data.credits.cast.slice(0, 8); // Display only top 8 cast members
                    
                    let castHTML = '';
                    cast.forEach(person => {
                        castHTML += `
                            <div class="cast-member">
                                <img src="${person.profile_path ? IMG_URL + person.profile_path : 'http://via.placeholder.com/150x225'}" 
                                     alt="${person.name}" class="cast-image">
                                <div class="cast-details">
                                    <h4>${person.name}</h4>
                                    <p>${person.character}</p>
                                </div>
                            </div>
                        `;
                    });
                    
                    castListContainer.innerHTML = castHTML;
                }
                
                // Load the trailer after loading the details
                loadTrailer();
                loadBackdrops();
            })
            .catch(err => {
                console.error('Error fetching details:', err);
                if (infoContainer) {
                    infoContainer.innerHTML = '<p class="error">Error loading details</p>';
                }
            });
    }
    
    function loadTrailer() {
        if (!id || !videoContainer) return;
        
        fetch(`${BASE_URL}/${contentType}/${id}/videos?${API_KEY}`)
            .then(res => res.json())
            .then(videoData => {
                console.log('Video data:', videoData);
                
                if (videoData && videoData.results.length > 0) {
                    // First look for official trailers
                    let trailer = videoData.results.find(video => 
                        video.site === 'YouTube' && 
                        (video.type === 'Trailer') && 
                        video.name.toLowerCase().includes('trailer')
                    );
                    
                    // If no official trailer found, look for any trailer
                    if (!trailer) {
                        trailer = videoData.results.find(video => 
                            video.site === 'YouTube' && 
                            (video.type === 'Trailer')
                        );
                    }
                    
                    // If still no trailer, just use the first YouTube video
                    if (!trailer) {
                        trailer = videoData.results.find(video => video.site === 'YouTube');
                    }
                    
                    if (trailer) {
                        const { name, key } = trailer;
                        
                        videoContainer.innerHTML = `
                            <div class="trailer-container">
                                <h2>Official Trailer</h2>
                                <iframe width="100%" height="480" src="https://www.youtube.com/embed/${key}" 
                                    title="${name}" frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen>
                                </iframe>
                            </div>
                        `;
                    } else {
                        videoContainer.innerHTML = '<p class="no-results">No trailer available</p>';
                    }
                } else {
                    videoContainer.innerHTML = '<p class="no-results">No trailer available</p>';
                }
            })
            .catch(err => {
                console.error('Error fetching trailer:', err);
                videoContainer.innerHTML = '<p class="no-results">Error loading trailer</p>';
            });
    }

    // Find the loadDetails function in the detail page code and add this new function below it
function loadBackdrops() {
  if (!id) return;
  
  // Create backdrop container if it doesn't exist yet
  if (!document.getElementById('backdrop-container')) {
      const backdropSection = document.createElement('section');
      backdropSection.id = 'backdrop-container';
      backdropSection.className = 'backdrop-gallery';
      backdropSection.innerHTML = '<h2>Backdrops</h2><div class="backdrop-grid"></div>';
      
      // Insert it after the trailer section
      videoContainer.parentNode.insertBefore(backdropSection, videoContainer.nextSibling);
  }
  
  const backdropGrid = document.querySelector('.backdrop-grid');
  
  // Fetch images
  fetch(`${BASE_URL}/${contentType}/${id}/images?${API_KEY}`)
      .then(res => res.json())
      .then(data => {
          console.log('Backdrop data:', data);
          
          if (data && data.backdrops && data.backdrops.length > 0) {
              // Limit to showing maximum 6 backdrops
              const backdrops = data.backdrops.slice(0, 6);
              
              let backdropHTML = '';
              backdrops.forEach(backdrop => {
                  backdropHTML += `
                      <div class="backdrop-item">
                          <img src="${IMG_URL}${backdrop.file_path}" 
                               alt="Backdrop" 
                               class="backdrop-image"
                               loading="lazy">
                      </div>
                  `;
              });
              
              backdropGrid.innerHTML = backdropHTML;
              
              // Add click functionality to view backdrops in larger size
              document.querySelectorAll('.backdrop-item').forEach(item => {
                  item.addEventListener('click', function() {
                      const imgSrc = this.querySelector('img').src;
                      // Create a modal to show full size backdrop
                      const modal = document.createElement('div');
                      modal.className = 'backdrop-modal';
                      modal.innerHTML = `
                          <div class="backdrop-modal-content">
                              <span class="backdrop-close">&times;</span>
                              <img src="${imgSrc.replace('/w500/', '/original/')}" alt="Backdrop">
                          </div>
                      `;
                      document.body.appendChild(modal);
                      
                      // Close modal when clicking the × or outside the image
                      modal.querySelector('.backdrop-close').addEventListener('click', () => {
                          document.body.removeChild(modal);
                      });
                      modal.addEventListener('click', (e) => {
                          if (e.target === modal) {
                              document.body.removeChild(modal);
                          }
                      });
                  });
              });
          } else {
              backdropGrid.innerHTML = '<p class="no-results">No backdrops available</p>';
          }
      })
      .catch(err => {
          console.error('Error fetching backdrops:', err);
          backdropGrid.innerHTML = '<p class="error">Error loading backdrops</p>';
      });
}
    
    function getColor(vote) {
        if(vote >= 8){
            return 'green'
        }else if(vote >= 5){
            return "orange"
        }else{
            return 'red'
        }
    }
}