// Declaramos las const
const formulario = document.getElementById('ingreso-persona');
const botonEliminarTodasLasFilas = document.getElementById('deleteall');
const tabla = document.getElementById('tabla');
const tablaTBody = tabla.getElementsByTagName('tbody')[0];
const rolPersonalInput = document.getElementById('personalRadio')
const rolHuespedInput = document.getElementById('huespedRadio')
const valorRolInput = document.querySelector('input[name="inlineRadioOptions"]:checked')?.value;
const nombreInput = document.getElementById('nombre');
const edadInput = document.getElementById('edad');
const botonRegistrar = document.getElementById('botonRegistrar');
const botonGuardarEdicion = document.getElementById('botonGuardarEdicion');
const personasLocalStorage = JSON.parse(localStorage.getItem('personas')) || [];
const personas = personasLocalStorage.map((persona) => {
    return new Persona(persona);
});


// const para agregar fila nueva a la tabla
const agregarFilaATabla = (persona) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${persona.rol}</td>
        <td>${persona.nombre}</td>
        <td>${persona.edad}</td>
    `;

    const nombre = persona.nombre;

    // boton editar
    const botonEditar = document.createElement('botonEditar');
    botonEditar.innerHTML = `<button class="btn btn-info">Editar</button>`;
    botonEditar.onclick = () => {
        botonRegistrar.setAttribute('style', 'visibility:hidden !important;display:none !important');
        botonGuardarEdicion.setAttribute('style', 'visibility:visible !important;display:block !important');
        const personaEncontrada = personas.find((elemento) => elemento.nombre === nombre);
        const indice = personas.indexOf(personaEncontrada);
        console.log(indice)
        if (personaEncontrada.rol === "Personal") {
            rolPersonalInput.checked = true;
        } else {
            rolHuespedInput.checked = true;
        }
        nombreInput.value = personaEncontrada.nombre;
        edadInput.value = personaEncontrada.edad;
        for(let i = 1; i < tabla.rows.length; i++)
        {
            tabla.rows[i].onclick = function()
            {
                rIndex = this.rowIndex;
                    console.log(rIndex)
            }
        }
    }
    tr.append(botonEditar);

    // boton guardar edicion
    botonGuardarEdicion.onclick = () => {
        const personaEncontrada = personas.find((elemento) => elemento.nombre === nombre);
        console.log(personaEncontrada)
        const indice = personas.indexOf(personaEncontrada);
        console.log(indice)
        
        tabla.rows[indice].cells[0].innerHTML = obtener_valor_radio();
        tabla.rows[indice].cells[1].innerHTML = nombreInput.value;
        tabla.rows[indice].cells[2].innerHTML = edadInput.value;
        if (tabla.rows[indice].cells[0].innerHTML === "Personal") {
            personaEncontrada.rol = "Personal"
        } else {
            personaEncontrada.rol = "Huesped"
        }
        personaEncontrada.nombre = tabla.rows[indice].cells[1].innerHTML;
        personaEncontrada.edad = edadInput.value;

        localStorage.setItem('personas', JSON.stringify(personas));
    };


    const botonEliminar = document.createElement('botonEliminar');
    botonEliminar.innerHTML = `<button class="btn btn-danger">Borrar</button>`;
    botonEliminar.onclick = () => {
        borrarPersonaDelStorage();
        tr.remove();
        botonBorradoListaEsVisible()
        listaEsVisible();
    }

    tr.append(botonEliminar);

    tablaTBody.append(tr);
}


const borrarPersonaDelStorage = (nombre) => {
    const personaEncontrada = personas.find((elemento) => elemento.nombre === nombre);
    const indice = personas.indexOf(personaEncontrada);
    personas.splice(indice, 1);
    localStorage.setItem('personas', JSON.stringify(personas));
}

botonGuardarEdicion.setAttribute('style', 'display:none;visibility:hidden');


const botonBorradoListaEsVisible = () => {
    if (personas.length > 1) {
        botonEliminarTodasLasFilas.setAttribute('style', 'visibility:visible !important');
    } else {
        botonEliminarTodasLasFilas.setAttribute('style', 'visibility:hidden !important');     
    }
}

botonBorradoListaEsVisible();

const listaEsVisible = () => {
    if (personas.length > 0) {
        tabla.setAttribute('style', 'visibility:visible !important')
    } else {
        tabla.setAttribute('style', 'visibility:hidden !important')        
    }
}

listaEsVisible();

const reiniciar_valores_radio = () => {
    let inputsRadio = document.getElementsByName("inlineRadioOptions");
    for (let i = 0; i < inputsRadio.length; i++) {
        if (inputsRadio[i].checked) {
            inputsRadio[i].checked = false;
        }
    }
}

const obtener_valor_radio = () => {
    let inputs = document.getElementsByName("inlineRadioOptions");
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            return inputs[i].value;
        }
    }
}


// for (const persona of personas) {
//     agregarFilaATabla(persona);
// }
personas.forEach((persona) => {
    agregarFilaATabla(persona);
})

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const persona = new Persona({
        rol: obtener_valor_radio(),
        nombre: e.target[2].value,
        edad: e.target[3].value
    });

    personas.push(persona);
    localStorage.setItem('personas', JSON.stringify(personas));

    agregarFilaATabla(persona);
    botonBorradoListaEsVisible()
    listaEsVisible();

    for (const input of e.target) {
        if (input.getAttribute('type') !== "radio") {
            input.value = '';
        } else {
            reiniciar_valores_radio();
        }
    }

    botonEliminarTodasLasFilas.onclick = () => {
        tablaTBody.innerHTML = ''
        localStorage.clear();
        personas.length = 0;
        botonBorradoListaEsVisible();
        listaEsVisible();
    }

    botonBorradoListaEsVisible();
    listaEsVisible();
});