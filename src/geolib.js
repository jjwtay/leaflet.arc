export const computeDestinationPoint = (
    start = {lat: 0, lng: 0},
    distance = 1,
    bearing = 0,
    radius = 6378137
) => {

    let bng = bearing * Math.PI / 180

    var lat1 = start.lat * Math.PI / 180
    var lon1 = start.lng * Math.PI / 180

    var lat2 = Math.asin( Math.sin(lat1)*Math.cos(distance/radius) +
        Math.cos(lat1)*Math.sin(distance/radius)*Math.cos(bng))

    var lon2 = lon1 + Math.atan2(Math.sin(bng)*Math.sin(distance/radius)*Math.cos(lat1),
                Math.cos(distance/radius)-Math.sin(lat1)*Math.sin(lat2))
                
    lat2 = lat2 * 180 / Math.PI
    lon2 = lon2 * 180 / Math.PI

    return {
        lat: lat2,
        lng: lon2
    }

}

