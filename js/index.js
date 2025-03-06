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
            const ciudadSelect = document.getElementById('ciudad');
            ciudadSelect.innerHTML = '<option value="">Selecciona una ciudad</option>';
            ciudadSelect.disabled = true;
        }
    });
};

// Inicializar
init();


//Validacion del formulario
const formulario = document.getElementById('formulario');
const provincia = document.getElementById('provincia');
const ciudad = document.getElementById('ciudad');
const fechaIda = document.getElementById('fecha-ida');
const fechaVuelta = document.getElementById('fecha-vuelta');
const personas = document.getElementById('personas');
const incorrectBox = document.getElementById('incorrectBox');
const correctBox = document.getElementById('correctBox');
const incorrectMessage = document.getElementById('incorrectMessage');
const correctMessage = document.getElementById('correctMessage');

function resetValidationIcons() {
    const inputs = document.querySelectorAll('#formulario input, #formulario select');
    inputs.forEach(input => {
        input.classList.remove('border-red-500', 'border-green-500');
    });
}

function showError(input) {
    input.classList.add('border-red-500');
    input.classList.remove('border-green-500');
}

function showSuccess(input) {
    input.classList.add('border-green-500');
    input.classList.remove('border-red-500');
}

// Validar formulario
function validarFormulario(event) {
    event.preventDefault();

    let valid = true;
    const errorMessages = [];

    resetValidationIcons();

    // Validar provincia
    if (!provinciaSelect.value) {
        showError(provinciaSelect);
        errorMessages.push('Por favor, selecciona una provincia.');
        valid = false;
    } else {
        showSuccess(provinciaSelect);
    }

    // Validar ciudad
    if (!ciudadSelect.value) {
        showError(ciudadSelect);
        errorMessages.push('Por favor, selecciona una ciudad.');
        valid = false;
    } else {
        showSuccess(ciudadSelect);
    }

    // Validar fechas
    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);

    const año = manana.getFullYear();
    let mes = manana.getMonth() + 1;
    if (mes < 10) {
        mes = '0' + mes;
    }
    let día = manana.getDate();
    if (día < 10) {
        día = '0' + día;
    }

    const fechaMinima = `${año}-${mes}-${día}`;

    if (!fechaIda.value || fechaIda.value < fechaMinima) {
        showError(fechaIda);
        errorMessages.push(`La fecha de ida debe ser al menos ${fechaMinima}.`);
        valid = false;
    } else {
        showSuccess(fechaIda);
    }

    // Validar fecha de vuelta
    if (!fechaVuelta.value || fechaVuelta.value <= fechaIda.value) {
        showError(fechaVuelta);
        errorMessages.push('La fecha de vuelta debe ser posterior a la fecha de ida.');
        valid = false;
    } else {
        showSuccess(fechaVuelta);
    }

    // Validar personas
    const numeroPersonas = parseInt(personas.value, 10);
    if (isNaN(numeroPersonas) || numeroPersonas < 1 || numeroPersonas > 10) {
        showError(personas);
        errorMessages.push('El número de personas debe ser entre 1 y 10.');
        valid = false;
    } else {
        showSuccess(personas);
    }

    // Mostrar validacion
    if (valid) {
        // Guardar los datos en LocalStorage
        const datosFormulario = {
            provincia: provinciaSelect.value,
            ciudad: ciudadSelect.value,
            fechaIda: fechaIda.value,
            fechaVuelta: fechaVuelta.value,
            personas: personas.value,
        };
        localStorage.setItem('datosFormulario', JSON.stringify(datosFormulario));

        window.location.href = './pages/search.html';
    } else {
        // Mensajes de error
        incorrectMessage.innerHTML = '';
        errorMessages.forEach(error => {
            const errorItem = document.createElement('p');
            errorItem.textContent = `- ${error}`;
            incorrectMessage.appendChild(errorItem);
        });
        incorrectBox.classList.remove('hidden');
        incorrectBox.classList.add('block');
        correctBox.classList.add('hidden');
    }
}

formulario.addEventListener('submit', validarFormulario);