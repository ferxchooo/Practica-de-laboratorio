function mostrarSeccion(id) {
    document.querySelectorAll('.seccion').forEach(sec => sec.classList.remove('activa'));
    document.getElementById(id).classList.add('activa');
}

window.onload = () => {
    let dias = '<option value="">Día</option>';
    let meses = '<option value="">Mes</option>';
    let anios = '<option value="">Año</option>';
    
    for(let i = 1; i <= 31; i++) dias += `<option value="${i}">${i}</option>`;
    for(let i = 1; i <= 12; i++) meses += `<option value="${i}">${i}</option>`;
    
    const anioActual = new Date().getFullYear();
    for(let i = anioActual; i >= 1900; i--) anios += `<option value="${i}">${i}</option>`;
    
    document.getElementById('dia').innerHTML = dias;
    document.getElementById('mes').innerHTML = meses;
    document.getElementById('anio').innerHTML = anios;
};

function calcularEdad() {
    const d = parseInt(document.getElementById('dia').value);
    const m = parseInt(document.getElementById('mes').value) - 1;
    const y = parseInt(document.getElementById('anio').value);
    
    if(isNaN(d) || isNaN(m) || isNaN(y)) {
        document.getElementById('resultadoEdad').innerText = "Por favor selecciona una fecha completa.";
        return;
    }

    const fechaNacimiento = new Date(y, m, d);
    const hoy = new Date();
    
    if (fechaNacimiento > hoy || fechaNacimiento.getDate() !== d || fechaNacimiento.getMonth() !== m) {
        document.getElementById('resultadoEdad').innerText = "La fecha ingresada no es válida.";
        return;
    }

    let anios = hoy.getFullYear() - fechaNacimiento.getFullYear();
    let meses = hoy.getMonth() - fechaNacimiento.getMonth();
    
    if (meses < 0 || (meses === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        anios--;
        meses += 12;
    }
    
    document.getElementById('resultadoEdad').innerText = `Tienes ${anios} años y ${meses} meses de edad.`;
}

function validarCamposTemp() {
    const val = document.getElementById('valorTemp').value;
    const origen = document.getElementById('unidadOrigen').value;
    const destino = document.getElementById('unidadDestino').value;
    document.getElementById('btnConvertir').disabled = !(val !== "" && origen !== "" && destino !== "");
}

function convertirTemperatura() {
    let val = parseFloat(document.getElementById('valorTemp').value);
    const origen = document.getElementById('unidadOrigen').value;
    const destino = document.getElementById('unidadDestino').value;
    let resultado = 0;

    if (origen === destino) resultado = val;
    else if (origen === 'C' && destino === 'F') resultado = (val * 9/5) + 32;
    else if (origen === 'C' && destino === 'K') resultado = val + 273.15;
    else if (origen === 'F' && destino === 'C') resultado = (val - 32) * 5/9;
    else if (origen === 'F' && destino === 'K') resultado = (val - 32) * 5/9 + 273.15;
    else if (origen === 'K' && destino === 'C') resultado = val - 273.15;
    else if (origen === 'K' && destino === 'F') resultado = (val - 273.15) * 9/5 + 32;

    const nombresUnidades = { 'C': 'Celsius', 'F': 'Fahrenheit', 'K': 'Kelvin' };
    document.getElementById('resultadoTemp').innerText = `${val} ${nombresUnidades[origen]} son ${resultado.toFixed(2)} ${nombresUnidades[destino]}`;
}

let arregloTareas = [];

function agregarTarea(e) {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
        arregloTareas.push({ descripcion: e.target.value.trim(), completada: false });
        e.target.value = '';
        renderTasks();
    }
}

function alternarTarea(index) {
    arregloTareas[index].completada = !arregloTareas[index].completada;
    renderTasks();
}

function eliminarTarea(index) {
    arregloTareas.splice(index, 1);
    renderTasks();
}

function renderTasks() {
    const lista = document.getElementById('listaTareas');
    lista.innerHTML = '';
    
    const tareasOrdenadas = [...arregloTareas].sort((a, b) => a.completada - b.completada);
    
    arregloTareas.forEach((tarea, indiceReal) => {
        tarea.indiceOriginal = indiceReal; 
    });

    tareasOrdenadas.forEach((tarea) => {
        const li = document.createElement('li');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = tarea.completada;
        checkbox.onchange = () => alternarTarea(tarea.indiceOriginal);
        
        const span = document.createElement('span');
        span.innerText = tarea.descripcion;
        if(tarea.completada) span.classList.add('completada');
        
        const btnEliminar = document.createElement('button');
        btnEliminar.innerHTML = '🗑️';
        btnEliminar.classList.add('btn-eliminar');
        btnEliminar.onclick = () => eliminarTarea(tarea.indiceOriginal);
        
        li.append(checkbox, span, btnEliminar);
        lista.appendChild(li);
    });
}