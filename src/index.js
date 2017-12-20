import { leerArchivoNavegacion, 
    leerArchivoObservacion, 
    leerArchivo } from './lectura';
import {calcular} from './calculo';
import 'font-awesome/less/font-awesome.less';        
import 'bulma';
import './index.css';
import $ from "jquery";

let navegacion = null;
let observacion = null;

$('#navegacion').on('change', function (e) {
    leerArchivo(e).then(leerArchivoNavegacion)
        .then(resultado => navegacion = resultado)
        .catch(error => {
            mostrarError("Error al leer el archivo de navegación");
            console.warn(error);
        });
}); 
$('#observacion').on('change', function (e) {
    leerArchivo(e).then(leerArchivoObservacion)
        .then(resultado => observacion = resultado)
        .catch(error => {
            mostrarError("Error al leer el archivo de observación");
            console.warn(error);
        });
}); 

$('#calcular').on('click', function (e) {
    calcular(navegacion, observacion)
        .then(resultados => {
            document.getElementById("datos").innerHTML = "";
            resultados.forEach(r => {
                let tr = document.createElement("tr");
                Object.keys(r).forEach(k => crearTD(tr, `${r[k]}`))
                document.getElementById("datos").appendChild(tr);
            });
            mostrarResultado("Calculos finalizados");
        })
        .catch(error => {
            mostrarError(error);
            console.warn(error);
        });
}); 

function crearTD (tr, texto) {
    let td = document.createElement("td");
    td.innerHTML = texto;
    tr.appendChild(td);
}

$("#cerrarMensaje").first().on("click", function () {
    $("#mensaje").addClass("is-invisible");
});

function mostrarError (mensaje) {
    $("#mensaje").removeClass("is-invisible is-success");
    $("#mensaje").addClass("is-warning");
    $("#mensajeContenido").html(mensaje);
}

function mostrarResultado (mensaje) {
    $("#mensaje").removeClass("is-invisible is-warning");
    $("#mensaje").addClass("is-success");
    $("#mensajeContenido").html(mensaje);
}


