const cargarTiempo = async () => {
    try {
        // Obtener LocalStorage
        const datosFormulario = JSON.parse(localStorage.getItem('datosFormulario'));
        if (!datosFormulario || !datosFormulario.ciudad) {
            throw new Error('No se encontró un destino válido en el localStorage.');
        }

        // Nombre de la ciudad
        const ciudad = datosFormulario.ciudad.trim().toLowerCase().replace(/\s+/g, '');
        const apiKeyWeather = 'py7th9mgz7npy8popba5kel35fynevww8rlb7zno';

        // Primera API: Obtener LAT y LON de la ciudad
        const findPlacesUrl = `https://www.meteosource.com/api/v1/free/find_places?text=${ciudad}&key=${apiKeyWeather}`;
        const findPlacesResponse = await fetch(findPlacesUrl);
        const findPlacesData = await findPlacesResponse.json();

        if (!findPlacesData || !findPlacesData.length) {
            throw new Error('No se encontró información para la ciudad proporcionada.');
        }

        const { lat, lon } = findPlacesData[0];

        // Segunda API: Tiempo usando LAT y LON
        const weatherUrl = `https://www.meteosource.com/api/v1/free/point?lat=${lat}&lon=${lon}&sections=all&timezone=UTC&language=en&units=metric&key=${apiKeyWeather}`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        if (!weatherData || !weatherData.daily || !weatherData.daily.data || !weatherData.daily.data.length) {
            throw new Error('No se pudo obtener la información diaria del tiempo.');
        }

        // Diario del clima
        const dailyWeather = weatherData.daily.data.map(day => ({
            fecha: day.day,
            temperatura: day.all_day.temperature,
            minima: day.all_day.temperature_min,
            maxima: day.all_day.temperature_max,
            resumen: day.summary.split('.')[0],
        }));

        // Actualizar el contenido del aside
        const weatherInfo = document.getElementById('weather-info');
        weatherInfo.innerHTML = '';

        const ul = document.createElement('ul');
        ul.classList.add('space-y-4');

        dailyWeather.forEach(day => {
            const li = document.createElement('li');
            li.classList.add('flex', 'flex-col');

            const fecha = document.createElement('span');
            fecha.classList.add('font-bold');
            fecha.textContent = day.fecha;

            const resumen = document.createElement('span');
            resumen.textContent = `Resumen: ${day.resumen}`;

            const temperatura = document.createElement('span');
            temperatura.textContent = `Temperatura: ${day.temperatura}°C`;

            const minMax = document.createElement('span');
            minMax.textContent = `Mínima: ${day.minima}°C / Máxima: ${day.maxima}°C`;

            li.appendChild(fecha);
            li.appendChild(resumen);
            li.appendChild(temperatura);
            li.appendChild(minMax);

            ul.appendChild(li);
        });

        weatherInfo.appendChild(ul);
    } catch (error) {
        const weatherInfo = document.getElementById('weather-info');
        weatherInfo.innerHTML = '';
        const errorMessage = document.createElement('p');
        errorMessage.classList.add('text-red-500');
        errorMessage.textContent = `Error: ${error.message}`;
        weatherInfo.appendChild(errorMessage);
        console.error(error);
    }
};

// Cargar el tiempo al cargar la página
cargarTiempo();


// Cargar Hoteles
const cargarHoteles = async () => {
    try {
        // Obtener datos del LocalStorage
        const datosFormulario = JSON.parse(localStorage.getItem('datosFormulario'));
        if (!datosFormulario || !datosFormulario.ciudad) {
            throw new Error('No se encontró un destino válido en el localStorage.');
        }

        // Obtener nombre de la ciudad
        const ciudad = datosFormulario.ciudad.trim().toLowerCase().replace(/\s+/g, '');
        const apiKey = "AIzaSyAVvdV2VzP4E27lXaYNtBKwRq9LdMbzDlY";

        // URL de la API
        const hotelsUrl = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=hotels+in+${ciudad}&key=${apiKey}`;
        const response = await fetch(hotelsUrl);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Verificar datos
        if (!data.results || !Array.isArray(data.results)) {
            throw new Error('No se encontraron hoteles para la ciudad proporcionada.');
        }

        // Actualizar el contenido del contenedor de hoteles
        const hotelsContainer = document.getElementById('hotels-container');
        hotelsContainer.innerHTML = '';
        hotelsContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'; // Grid para alineación uniforme

        // Crear tarjetas para cada hotel
        data.results.forEach(result => {
            const icon = result.icon || 'https://via.placeholder.com/50?text=Icono';
            const name = result.name || 'Sin nombre';

            const hotelElement = document.createElement('div');
            hotelElement.className = 'border border-gray-300 rounded-lg shadow-md flex flex-col justify-between p-4';

            let photoUrl = '';
            if (result.photos && result.photos.length > 0) {
                const photoReference = result.photos[0].photo_reference;
                photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
            } else {
                photoUrl = 'https://via.placeholder.com/400x300?text=Sin+imagen';
            }

            const hotelPhoto = document.createElement('img');
            hotelPhoto.src = photoUrl;
            hotelPhoto.alt = 'Imagen del hotel';
            hotelPhoto.className = 'w-full rounded-t-lg h-48 object-cover';

            // Crear el contenedor para el nombre y el icono
            const infoContainer = document.createElement('div');
            infoContainer.className = 'flex flex-col justify-between items-center mt-4 h-full';

            const hotelName = document.createElement('h2');
            hotelName.textContent = name;
            hotelName.className = 'text-lg font-semibold mb-2 text-center';

            const iconImg = document.createElement('img');
            iconImg.src = icon;
            iconImg.alt = 'Icono del hotel';
            iconImg.className = 'w-6 h-6'; // Tamaño reducido a la mitad

            infoContainer.appendChild(hotelName);
            infoContainer.appendChild(iconImg);

            hotelElement.appendChild(hotelPhoto);
            hotelElement.appendChild(infoContainer);

            hotelsContainer.appendChild(hotelElement);
        });

    } catch (error) {
        const hotelsContainer = document.getElementById('hotels-container');
        hotelsContainer.innerHTML = '';
        const errorMessage = document.createElement('p');
        errorMessage.className = 'text-center text-red-500 mt-4';
        errorMessage.textContent = `Error: ${error.message}`;
        hotelsContainer.appendChild(errorMessage);
        console.error('Error al cargar los hoteles:', error);
    }
};

// Cargar los hoteles al cargar la página
cargarHoteles();