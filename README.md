# leaflet.arc
Leaflet Arc support. Inspired by [leaflet.ellipse](https://github.com/jdfergason/Leaflet.Ellipse).

## API

*Factory method*

    L.arc({
              <LatLng> center,
              <Number> radius,
              <Number> startBearing,
              <Number> endBearing
              <...Leaflet Polyline Options>
    })

    * center - Leaflet latlng (optional - [0,0])
    * radius - in meters (optional - 100)
    * startBearing - bearing in degrees (optional - 0)
    * endBearing - bearing in degrees (optional - 90)
    * any leaflet polyline options 

## Also checkout

[leaflet.box](https://github.com/jjwtay/leaflet.box) - Leaflet support for Box drawings (rotatable rectangle)


## License

This code is provided under the Apache 2.0 license.
