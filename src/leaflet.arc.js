L.Arc = L.Polyline.extend({
    options: {
        weight: 5,
        color: '#ffff00',
        stroke: true
    },

    initialize: function ({
        center = [0, 0],
        radius = 100,
        startBearing = 0,
        endBearing = 90,
        numberOfPoints = 32,
        ...options
    }) {
        this.setOptions(options)
            .setCenter(center)
            .setRadius(radius)
            .setStartBearing(startBearing)
            .setEndBearing(endBearing)
            .setNumberOfPoints(numberOfPoints)

        this._setLatLngs(this.getLatLngs())
    },

    getCenter: function() { return this._center },

    setCenter: function(center) {
        this._center = L.latLng(center)
        return this.redraw()
    },

    getRadius: function () { return this._radius },

    setRadius: function (radius = 100) {
        this._radius = Math.abs(radius)
        return this.redraw()
    },

    getStartBearing: function () { return this._startBearing },

    setStartBearing: function (startBearing = 0) {
        if (this.getEndBearing() && this.getEndBearing() < startBearing) {
            while (this.getEndBearing() <=  startBearing) {
                startBearing -= 360
            }
        }
        this._startBearing = startBearing
        return this.redraw()
    },

    getEndBearing: function () { return this._endBearing },

    setEndBearing: function (endBearing = 90) {
        if (this.getStartBearing() && this.getStartBearing() > endBearing) {
            while (this.getStartBearing() >= endBearing) {
                endBearing += 360
            }
        }
        this._endBearing = endBearing
        return this.redraw()
    },

    getNumberOfPoints: function () { return this._numberOfPoints },

    setNumberOfPoints: function (numberOfPoints = 32) {
        this._numberOfPoints = Math.max(10, numberOfPoints)
        return this.redraw()
    },

    getOptions: function () { return this.options },

    setOptions: function (options = {}) {
        L.setOptions(this, options)
        return this.redraw()
    },

    getLatLngs() {
        let angle = this.getEndBearing() - this.getStartBearing()
        let ptCount = angle * this.getNumberOfPoints() / 360
        let latlngs = []
        let deltaAngle = angle/ptCount

        for (var i = 0; i < ptCount + 1; i++) {
            let useAngle = this.getStartBearing() + deltaAngle * i
            latlngs.push(this.computeDestinationPoint(
                this.getCenter(),
                this.getRadius(),
                useAngle
            ))
        }
        return latlngs
    },

    setLatLngs: function(latLngs) {
        this._setLatLngs(this.getLatLngs())
        return this.redraw()
    },

    setStyle: L.Path.prototype.setStyle,

    computeDestinationPoint: function (
        start = {lat: 0, lng: 0},
        distance = 1,
        bearing = 0,
        radius = 6378137
    ) {

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
})

L.arc = ({
    center = [0, 0],
    radius = 100,
    startBearing = 0,
    endBearing = 90,
    numberOfPoints = 32,
    ...options
}) =>
    new L.Arc({center, radius, startBearing, numberOfPoints, endBearing, ...options})


