# leaflet.arc
Leaflet Arc support. Inspired by [leaflet.ellipse](https://github.com/jdfergason/Leaflet.Ellipse). [Demo](https://jjwtay.github.io/leaflet.arc/)

## How to

*Traditional*

    Include leaflet.arc.js in your html

    <script src='/path/to/leaflet.arc'></script>

*Webpack as non es6 module*

    import './path/to/leaflet.arc'

    * If using es6 with object spread you can opt to use the uncompiled src/leaflet.arc.js

*ES6 module*

    TODO

## API

*Factory method*

    L.arc({
              <LatLng> center,
              <Number> radius,
              <Number> startBearing,
              <Number> endBearing,
              <Boolean> rhumb,
              <...Leaflet Polyline Options>
    })

    * center - Leaflet latlng (optional - [0,0])
    * radius - in meters (optional - 100)
    * startBearing - bearing in degrees (optional - 0)
    * endBearing - bearing in degrees (optional - 90)
    * rhumb - whether to use rhumb or greater circle (optional - false)
    * any leaflet polyline options 

## Also checkout

[leaflet.box](https://github.com/jjwtay/leaflet.box) - Leaflet support for Box drawings (rotatable rectangle)

[leaflet.draw-box](https://github.com/jjwtay/leaflet.draw-box) - Leaflet Draw support for leaflet.box.

[leaflet.draw-arc](https://github.com/jjwtay/leaflet.draw-arc) - Leaflet Draw support for leaflet.arc.

[leaflet.sector](https://github.com/jjwtay/leaflet.sector) - Leaflet Sector drawing.

[leaflet.draw-sector](https://github.com/jjwtay/leaflet.draw-sector) - Leaflet Draw support for leaflet.sector.


## License

This code is provided under the Apache 2.0 license.
