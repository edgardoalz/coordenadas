function parseValue (value) {
    if (value.indexOf("D") != -1) {
        // console.log(value);
        let data = value.split('D').map(v => parseFloat(v));
        // console.log(data);
        data[1] = Math.pow(10, data[1]);
        // console.log(data);
        return data[0]*data[1];
    } else {
        return parseFloat(value);   
    }
}

export function leerArchivoNavegacion (data) {
    return new Promise((resolve, reject) => {
        const lines = data.split('\r\n').slice(4)
            .filter(line => line.length).map(line => {
                return [
                    line.substr(0,22).trim(), 
                    parseValue(line.substr(23,19).trim()),
                    parseValue(line.substr(41,19).trim()), 
                    parseValue(line.substr(60,19).trim())
                ]
            });
        let lastSatelite = null; 
        const satelites = lines.reduce((result, line) => {
            if (line[0].length >= 21) {
                lastSatelite = line[0].substr(0,2).trim();
                result[lastSatelite] = {
                    data : [], 
                    tgps: line[0].substr(3).split(/\s/)
                        .filter(n => n.length).map(e => parseValue(e))
                };
                line[0] = parseValue(line[0].substr(3).replace(/\s/g, ''));
                console.log(line[0]);
            } else {
                line[0] = parseValue(line[0])
            }
            result[lastSatelite].data.push(line);
            return result;
        },{});

        resolve(satelites);
    });
}

export function leerArchivoObservacion (data) {
    return new Promise((resolve, reject) => {
        const lines = data.split('\r\n').slice(17,18).filter(line => line.length)
            .map(line => line.substr(0, 25).split(/\s/)
                .filter(n => n.length).map(e => parseValue(e)))

        resolve(lines[0]);
    });
}

export function leerArchivo (e) {
    return new Promise((resolve, reject) => {
        const archivo = e.target.files[0];
        if (!archivo) {
          return;
        }
        const lector = new FileReader();
        lector.onload = function(e) {
          resolve(e.target.result);
        };
        lector.readAsText(archivo);
    });
}
