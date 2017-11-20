export const  toc = (dia, hora, min, seg) => 
    (dia*86400)+(hora*3600)+(min*60)+seg;

export const  tsv = toc;
export const Mk = -0.23937381588093;

export const tk = (tgps, toe) => tgps - toe;

export const tgps = (tsv, deltaTsv) => tsv - deltaTsv;

export const deltaTsv = (tgps, a0, a1, a2, toc) =>
    a0+a1 * (tgps - toc) + a2 * (parseFloat(tgps) - toc);

export const Ek = (mk, e) => {
    let E = mk;
    let diff = 1;
    while (diff >= 0.00000001) {
        let Et = E;
        E = mk + e * Math.sin(E);
        diff = E - Et;
    }
    return E;
}

export const cosVk = (Ek, e) => 
    (Math.cos(Ek)-e)/ 1-e*Math.cos(Ek);

export const senVk = (Ek, e) =>
    (Math.sqrt(1-Math.pow(e,2))*Math.sin(Ek)) / 1-e*Math.cos(Ek);

export const fik = (Vk, omega) => Vk + omega;

export const Vk = (cosVk, senVk) => {
    if (cosVk < 0) {
        return Math.atan(senVk/cosVk) + Math.PI;
    } else if (senVk < 0) {
        return Math.atan(senVk/cosVk) + 2*Math.PI;
    } else {
        return Math.atan(senVk/cosVk);
    }
}

export const calcular = (navegacion, observacion) => {
    return new Promise((resolve, reject) => {
        if (!navegacion) {
            reject("Agregue el archivo de navegación");
        } else if (!observacion) {
            reject("Agregue el archivo de observación");
        }

        const satelite = navegacion[7];
        console.log(satelite);
        const _toc = toc.apply(this, observacion.slice(2));
        console.log(_toc);
        const _tsv = tsv.apply(this, satelite.tgps.slice(2));
        console.log(_tsv);
        console.log(satelite.data[0].concat([_toc]));
        const _deltaTsv = deltaTsv.apply(null, satelite.data[0].concat([_toc]));
        console.log(_deltaTsv);
        const _tgps = tgps(_tsv, _deltaTsv);
        console.log(_tgps);
        const _tk = tk(_tgps, satelite.data[3][0]);
        console.log(_tk);
        resolve(_tk);
    });
}