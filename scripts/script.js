document.addEventListener('DOMContentLoaded', () => {
    displayRecentSearches();
});

document.getElementById('find-earthquakes').addEventListener('click', function() {
    const earthquakeUrl = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`;

    fetch(earthquakeUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Earthquake API response:', data);
            if (data.features && data.features.length > 0) {
                const filteredEarthquakes = data.features.filter(quake => quake.properties.mag >= 2.0);
                const sortedEarthquakes = filteredEarthquakes.sort((a, b) => new Date(b.properties.time) - new Date(a.properties.time)).slice(0, 10);
                populateEarthquakeList(sortedEarthquakes);
                document.getElementById('earthquake-list-container').classList.remove('hidden');
                document.getElementById('location-section').classList.remove('hidden');
            } else {
                showModal('No earthquakes found. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching earthquake data:', error);
            showModal('An error occurred while fetching earthquake data. Please try again.');
        });
});

function populateEarthquakeList(earthquakes) {
    const earthquakeList = document.getElementById('earthquake-list');
    earthquakeList.innerHTML = '';

    earthquakes.forEach((quake, index) => {
        const date = new Date(quake.properties.time).toLocaleString();
        const option = document.createElement('option');
        option.value = index;
        option.text = `Date: ${date}, Magnitude: ${quake.properties.mag}, Coordinates: (${quake.geometry.coordinates[1]}, ${quake.geometry.coordinates[0]})`;
        option.dataset.lat = quake.geometry.coordinates[1];
        option.dataset.lng = quake.geometry.coordinates[0];
        earthquakeList.add(option);
    });

    earthquakeList.addEventListener('change', function() {
        const selectedQuake = earthquakes[this.value];
        document.getElementById('latitude').value = selectedQuake.geometry.coordinates[1];
        document.getElementById('longitude').value = selectedQuake.geometry.coordinates[0];
    });

    if (earthquakes.length > 0) {
        earthquakeList.selectedIndex = 0;
        const firstQuake = earthquakes[0];
        document.getElementById('latitude').value = firstQuake.geometry.coordinates[1];
        document.getElementById('longitude').value = firstQuake.geometry.coordinates[0];
    }
}

document.getElementById('location-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const lat = document.getElementById('latitude').value;
    const lng = document.getElementById('longitude').value;
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const geoNamesUrl = `http://api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lng}&username=jimiliapis`;
    const fullUrl = `${proxyUrl}${encodeURIComponent(geoNamesUrl)}`;

    fetch(fullUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const jsonData = JSON.parse(data.contents);
            console.log('GeoNames Location API response:', jsonData);
            if (jsonData.geonames && jsonData.geonames.length > 0) {
                const location = jsonData.geonames[0];
                let locationInfo = `Location: ${location.name}`;
                if (location.countryCode === "US" && location.adminName1) {
                    locationInfo += `, ${location.adminName1}, ${location.countryName}`;
                } else {
                    locationInfo += `, ${location.countryName}`;
                }
                document.getElementById('neighborhood-info').innerText = locationInfo;
                saveSearchResult(locationInfo);
                showModal(locationInfo);
            } else {
                const fallbackLocation = `Location: ${lat}, ${lng}`;
                document.getElementById('neighborhood-info').innerText = fallbackLocation;
                saveSearchResult(fallbackLocation);
                showModal('No detailed location found for these coordinates.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showModal('An error occurred while fetching location data. Please try again.');
        });
});

function saveSearchResult(locationInfo) {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    searches.unshift(locationInfo);
    if (searches.length > 3) {
        searches.pop();
    }
    localStorage.setItem('searches', JSON.stringify(searches));
    displayRecentSearches();
}

function displayRecentSearches() {
    const recentSearchesContainer = document.getElementById('recent-searches');
    const searches = JSON.parse(localStorage.getItem('searches')) || [];
    recentSearchesContainer.innerHTML = '';

    searches.forEach(search => {
        const searchItem = document.createElement('div');
        searchItem.className = 'search-item';
        searchItem.textContent = search;
        recentSearchesContainer.appendChild(searchItem);
    });
}

function showModal(content) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `<p>${content}</p>`;
    modal.style.display = 'block';

    const closeBtn = document.getElementsByClassName('close')[0];
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}