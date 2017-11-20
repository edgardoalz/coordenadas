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
        .catch(error => console.warn(error));
}); 
$('#observacion').on('change', function (e) {
    leerArchivo(e).then(leerArchivoObservacion)
        .then(resultado => observacion = resultado)
        .catch(error => console.warn(error));
}); 

$('#calcular').on('click', function (e) {
    calcular(navegacion, observacion)
        .then(resultado => console.log(resultado))
        .catch(error => console.warn(error));
}); 


