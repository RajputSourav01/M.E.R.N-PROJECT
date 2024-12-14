// mapToken variable coming from show.ejs to make process.env.maptoken accesible

            // let mapToken = mapToken;
            // console.log(mapToken);
            mapboxgl.accessToken = mapToken;

            const map = new mapboxgl.Map({
                container: 'map', // container ID
                style: 'mapbox://styles/mapbox/satellite-streets-v12', // Supports terrain
                center: listing.geometry.coordinates , // starting position [lng,E, lat,N]. Note that lat must be set between -90 and 90
                zoom: 9 // starting zoom
            });

// console inspect to see coordinates which is pass from show.ejs
            console.log(listing);

            // add map marker to show location with their location cordinates
            const marker = new mapboxgl.Marker({color : "red"})
            .setLngLat(listing.geometry.coordinates) // listing.geometry.coordinates
            .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h6>${listing.location} </h6> <p>Nevigation will provided after booking!</p>`))
            .addTo(map);
        