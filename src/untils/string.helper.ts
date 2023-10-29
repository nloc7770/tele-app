export function secondsToHms(d: number) {
    d = Number(d);

    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + " giờ " + ('0' + m).slice(-2) + " phút " + ('0' + s).slice(-2) + ' giây';
}