async function registrarParticipante() {
    const nombres = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const edad = document.getElementById('edad').value.trim();
    const email = document.getElementById('email').value.trim();
    const celular = document.getElementById('celular').value.trim();
    const ciudad = document.getElementById('ciudad').value;
    const universidad = document.getElementById('universidad').value;
    let carrera = document.getElementById('carrera').value;
    const otraCarrera = document.getElementById('carrera_otra').value.trim();

    // Validaciones
    if (!nombres || !apellidos || !edad || !email || !celular || !ciudad || !universidad || !carrera) {
        mostrarWarning('❌ Por favor completa todos los campos obligatorios.');
        return;
    }

    if (!validarEdad(edad)) return;

    const acepta = document.getElementById('acepta_contacto').value;
    if (acepta !== 'Sí') {
        mostrarWarning('❌ Debes aceptar que te contacten para continuar.');
        return;
    }

    // Verificar duplicado local
    const duplicadoMsg = verificarDuplicado(email, celular);
    if (duplicadoMsg) {
        mostrarWarning(duplicadoMsg);
        return;
    }

    // Si carrera es "Otra", usar el campo otra_carrera
    if (carrera === 'Otra') {
        carrera = otraCarrera;
        if (!carrera) {
            mostrarWarning('❌ Por favor escribe el nombre de tu carrera');
            return;
        }
    }

    const nuevoRegistro = {
        nombres: nombres,
        apellidos: apellidos,
        edad: edad,
        email: email,
        celular: celular,
        ciudad: ciudad,
        universidad: universidad,
        carrera: carrera,
        otra_carrera: (carrera === 'Otra') ? otraCarrera : '',
        fecha: new Date().toLocaleString()
    };

    // Guardar en localStorage
    const registros = cargarRegistros();
    registros.push(nuevoRegistro);
    guardarRegistros(registros);
    actualizarTabla();

    // === ENVIAR A GOOGLE SHEETS ===
    const GOOGLE_SCRIPT_URL = "https://script.google.com/a/macros/aiesec.net/s/AKfycbzE4Ru0MzT8FYuZGAvZwNvRxikLmC7jHTjBnE4-FSwe_KXd_pUeVUazi0Lqm7n-tbkQ/exec"; // <-- CAMBIA ESTO

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoRegistro)
        });
        console.log('✅ Datos enviados a Google Sheets');
    } catch (error) {
        console.error('❌ Error al enviar a Google Sheets:', error);
    }

    limpiarFormulario();
    alert('✅ ¡Registro exitoso! Tus datos han sido guardados.');
}