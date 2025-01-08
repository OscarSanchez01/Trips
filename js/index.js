const provinciaSelect = document.getElementById('provincia');
const ciudadSelect = document.getElementById('ciudad');

const cargarProvincias = async () => {
    try {
        const response = await fetch('https://cors-anywhere.herokuapp.com/https://www.el-tiempo.net/api/json/v2/provincias');
        const data = await response.json();

        if (data.provincias && Array.isArray(data.provincias)) {
            const provinciaSelect = document.getElementById('provincia');
            data.provincias.forEach(provincia => {
                const option = document.createElement('option');
                option.value = provincia.CODPROV;
                option.textContent = provincia.NOMBRE_PROVINCIA;
                provinciaSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error al cargar las provincias:', error);
    }
};

const cargarCiudades = async (codProv) => {
    try {
        const response = await fetch(`https://cors-anywhere.herokuapp.com/https://www.el-tiempo.net/api/json/v2/provincias/${codProv}/municipios`);
        const data = await response.json();

        if (data.municipios && Array.isArray(data.municipios)) {
            const ciudadSelect = document.getElementById('ciudad');
            ciudadSelect.innerHTML = '<option value="">Selecciona una ciudad</option>';
            ciudadSelect.disabled = true;

            data.municipios.forEach(municipio => {
                const option = document.createElement('option');
                option.value = municipio.NOMBRE;
                option.textContent = municipio.NOMBRE;
                ciudadSelect.appendChild(option);
            });

            ciudadSelect.disabled = false;
        }
    } catch (error) {
        console.error('Error al cargar las ciudades:', error);
    }
};

const init = async () => {
    // Cargar provincias al inicio
    await cargarProvincias();

    // Añadir evento para actualizar las ciudades cuando cambie la provincia
    const provinciaSelect = document.getElementById('provincia');
    provinciaSelect.addEventListener('change', async (event) => {
        const codProv = event.target.value;
        if (codProv) {
            await cargarCiudades(codProv);
        } else {
            // Limpiar el select de ciudades si no hay provincia seleccionada
            const ciudadSelect = document.getElementById('ciudad');
            ciudadSelect.innerHTML = '<option value="">Selecciona una ciudad</option>';
            ciudadSelect.disabled = true;
        }
    });
};

// Inicializar
init();