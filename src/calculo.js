import {parseValue} from './lectura';

export const GM = parseValue('3.986005D+14');
export const We = parseValue('7.2921151457D-05');
export const PI = 3.1415926535898;
export const VLuz = 299792458;

export const  toc = (dia, hora, min, seg) => 
    (dia*86400)+(hora*3600)+(min*60)+seg;

export const  tsv = toc;

export const tk = (tgps, toe) => tgps - toe;

export const tgps = (tsv, deltaTsv) => tsv - deltaTsv;

export const deltaTsv = (tgps, a0, a1, a2, toc) =>
    a0+a1 * (tgps - toc) + a2 * (parseFloat(tgps) - toc);

export const Ek = (mk, e) => {
    let E = mk;
    let diff = 1;
    let i = 0;
    while (diff >= 0.00000000000001) {
        let Et = E;
        E = mk + e * Math.sin(E);
        diff = Math.abs(E - Et);
    }
    return E;
}

export const cosVk = (Ek, e) => 
    (Math.cos(Ek)-e)/ (1-e*Math.cos(Ek));

export const senVk = (Ek, e) =>
    (Math.sqrt(1-Math.pow(e,2))*Math.sin(Ek)) / (1-e*Math.cos(Ek));

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

export const thetaK = (vK, w) => vK + w;

export const n0 = A => Math.sqrt((GM/Math.pow(A, 3)));

export const n = (n0, deltaN) => n0 + deltaN;

export const Mk = (M0, n, Tk) => M0 + (n * Tk);

export const deltaXk = (Cxc, Cxs, thetaK) => (Cxc*Math.cos(2*thetaK)) + (Cxs*Math.sin(2*thetaK));

export const Uk = (thetaK, deltaUk) => thetaK + deltaUk;

export const Rk = (A, e, Ek, deltaRk) => (A*(1-(e*Math.cos(Ek)))) + deltaRk;

export const Ik = (i0, i, tk, deltaIk) => i0 + i*tk + deltaIk;

export const Xik = (rk, uk) => rk * Math.cos(uk);

export const Yik = (rk, uk) => rk * Math.sin(uk);

export const omegak = (omega0, omega, tk, toe) => omega0 + ((omega - We) * tk) - (We * toe);

export const Xk = (Xik, omegak, Yik, ik) => 
    Xik * Math.cos(omegak) - Yik * Math.sin(omegak) * Math.cos(ik);

export const Yk = (Xik, omegak, Yik, ik) => 
    Xik * Math.sin(omegak) + Yik * Math.cos(omegak) * Math.cos(ik);

export const Zk = (Yik, ik) => Yik * Math.sin(ik);

export const calcular = (navegacion, observacion) => {
    return new Promise((resolve, reject) => {
        if (!navegacion) {
            return reject("Agregue el archivo de navegación");
        } else if (!observacion) {
            return reject("Agregue el archivo de observación");
        }

        Promise.all(Object.keys(navegacion).map(k => 
            calculo(k, navegacion[k], observacion)
        )).then(resolve).catch(reject);
    });
}

export const calculo = (numero, satelite, observacion) => {
    return new Promise((resolve, reject) => {
        const _sqrtA = satelite.data[2][3];
        const _A = Math.pow(_sqrtA, 2);
        const _n0 = n0(_A);
        const _deltaN = satelite.data[1][2];
        const _n = n(_n0, _deltaN);
        const _M0 = satelite.data[1][3];
        const _toc = toc.apply(this, satelite.tgps.slice(2));
        const _tsv = tsv.apply(this, observacion.slice(2));
        const _deltaTsv = deltaTsv.apply(null, satelite.data[0].concat([_toc]));
        const _tgps = tgps(_tsv, _deltaTsv);
        const _toe = satelite.data[3][0];
        const _tk = tk(_tgps, _toe);
        const _Mk = Mk(_M0, _n, _tk);
        const _e = satelite.data[2][1];
        const _Ek = Ek(_Mk, _e);
        const _cosVk = cosVk(_Ek, _e);
        const _senVk = senVk(_Ek, _e);
        const _Vk = Vk(_cosVk, _senVk);
        const _w = satelite.data[4][2];
        const _thetaK = thetaK(_Vk, _w);
        const _Crc = satelite.data[1][1];
        const _Cuc = satelite.data[2][0];
        const _Cus = satelite.data[2][2];
        const _Cic = satelite.data[3][1];
        const _Cis = satelite.data[3][3];
        const _Crs = satelite.data[4][1];
        const _omega0 = satelite.data[3][2];
        const _i0 = satelite.data[4][0];
        const _omega = satelite.data[4][3];
        const _deltaUk = deltaXk(_Cuc, _Cus, _thetaK);
        const _deltaRk = deltaXk(_Crs, _Crc, _thetaK);
        const _deltaIk = deltaXk(_Cic, _Cis, _thetaK);
        const _Uk = Uk(_thetaK, _deltaUk);
        const _Rk = Rk(_A, _e, _Ek, _deltaRk);
        const _i = satelite.data[5][0];
        const _ik = Ik(_i0, _i, _tk, _deltaIk);
        const _Xik = Xik(_Rk, _Uk);
        const _Yik = Yik(_Rk, _Uk);
        const _omegak = omegak(_omega0, _omega, _tk, _toe);
        const _Xk = Xk(_Xik, _omegak, _Yik, _ik);
        const _Yk = Yk(_Xik, _omegak, _Yik, _ik);
        const _Zk = Zk(_Yik, _ik);
        resolve({
            satelite: numero, 
            x: _Xk.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'), 
            y: _Yk.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'), 
            z: _Zk.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
        });
    });
}