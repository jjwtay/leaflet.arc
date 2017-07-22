var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

//L.Draw.Arc = L.Draw.SimpleShape.extend({
L.Draw.Arc = L.Draw.Feature.extend({
    statics: {
        TYPE: 'arc'
    },

    options: {
        shapeOptions: {
            stroke: true,
            color: '#ffff00',
            weight: 5,
            opacity: 0.5,
            //fill: true,
            //fillColor: null, //same as color by default
            fillOpacity: 0.2,
            clickable: true
        },
        showRadius: true,
        metric: true, // Whether to use the metric measurement system or imperial
        lineOptions: {
            color: '#ffff00',
            weight: 5,
            dashArray: '5, 10'
        }
    },

    initialize: function initialize(map, options) {
        if (options && options.shapeOptions) {
            options.shapeOptions = L.Util.extend({}, this.options.shapeOptions, options.shapeOptions);
        }
        if (options && options.lineOptions) {
            options.lineOptions = L.Util.extend({}, this.options.lineOptions, options.lineOptions);
        }
        // Save the type so super can fire, need to do this as cannot do this.TYPE :(
        this.type = L.Draw.Arc.TYPE;

        this._initialLabelText = L.drawLocal.draw.handlers.arc.tooltip.start;

        L.Draw.Feature.prototype.initialize.call(this, map, options);
    },

    _drawShape: function _drawShape(latlng) {
        var radius = void 0,
            pc = void 0,
            ph = void 0,
            v = void 0,
            startBearing = void 0,
            endBearing = void 0;

        if (!this._shape) {

            radius = Math.max(this._startLatLng.distanceTo(latlng), 10);
            pc = this._map.project(this._startLatLng);
            ph = this._map.project(latlng);
            v = [ph.x - pc.x, ph.y - pc.y];
            startBearing = Math.atan2(v[0], -v[1]) * 180 / Math.PI % 360;

            this._shape = L.arc(_extends({
                center: this._startLatLng,
                radius: radius,
                startBearing: startBearing,
                endBearing: startBearing + 1
            }, this.options.shapeOptions));
            this._map.addLayer(this._shape);
        } else {

            pc = this._map.project(this._startLatLng);
            ph = this._map.project(latlng);
            v = [ph.x - pc.x, ph.y - pc.y];
            endBearing = Math.atan2(v[0], -v[1]) * 180 / Math.PI % 360;

            this._shape.setEndBearing(endBearing);
            this._shape.setLatLngs(this._shape.getLatLngs());
        }
    },

    _drawLine: function _drawLine(latlng) {
        if (!this._line) {
            this._line = L.polyline([this._startLatLng, latlng], this.options.lineOptions);
            this._map.addLayer(this._line);
        } else {
            this._line.setLatLngs([this._startLatLng, latlng]);
        }
    },

    _fireCreatedEvent: function _fireCreatedEvent() {
        var arc = L.arc(_extends({}, this.options.shapeOptions, {
            center: this._startLatLng,
            radius: this._shape.getRadius(),
            startBearing: this._shape.getStartBearing(),
            endBearing: this._shape.getEndBearing()
        }));

        L.Draw.SimpleShape.prototype._fireCreatedEvent.call(this, arc);
    },

    _onMouseMove: function _onMouseMove(e) {
        var latlng = e.latlng,
            radius = void 0,
            pc = void 0,
            ph = void 0,
            v = void 0,
            bearing = void 0;

        this._tooltip.updatePosition(latlng);

        if (this._isDrawing) {

            if (this._radius) {
                this._drawShape(latlng);

                pc = this._map.project(this._startLatLng);
                ph = this._map.project(latlng);
                v = [ph.x - pc.x, ph.y - pc.y];

                bearing = Math.atan2(v[0], -v[1]) * 180 / Math.PI % 360;

                this._tooltip.updateContent({
                    text: L.drawLocal.draw.handlers.arc.tooltip.end,
                    subtext: 'Bearing(degrees): ' + bearing
                });
            } else {
                radius = this._startLatLng.distanceTo(latlng);
                pc = this._map.project(this._startLatLng);
                ph = this._map.project(latlng);
                v = [ph.x - pc.x, ph.y - pc.y];

                bearing = Math.atan2(v[0], -v[1]) * 180 / Math.PI % 360;

                this._drawLine(latlng);
                this._tooltip.updateContent({
                    text: L.drawLocal.draw.handlers.arc.tooltip.line,
                    subtext: 'Radius(meters): ' + radius + ', Bearing(degrees): ' + bearing
                });
            }
        }
    },

    _onMouseDown: function _onMouseDown(e) {
        var latlng = e.latlng,
            pc = void 0,
            ph = void 0,
            v = void 0,
            newB = void 0;
        this._isDrawing = true;

        if (!this._startLatLng) {

            this._startLatLng = latlng;
        } else if (!this._radius) {
            pc = this._map.project(this._startLatLng);
            ph = this._map.project(latlng);
            v = [ph.x - pc.x, ph.y - pc.y];

            newB = Math.atan2(v[0], -v[1]) * 180 / Math.PI % 360;

            this._startBearing = newB;
            this._radius = this._startLatLng.distanceTo(latlng);
        } else {
            pc = this._map.project(this._startLatLng);
            ph = this._map.project(latlng);
            v = [ph.x - pc.x, ph.y - pc.y];

            newB = Math.atan2(v[0], -v[1]) * 180 / Math.PI % 360;

            this._endBearing = newB;
        }
    },

    _onMouseUp: function _onMouseUp(e) {
        if (this._endBearing) {
            this._fireCreatedEvent(e);

            this.disable();

            if (this.options.repeatMode) {
                this.enable();
            }
        }
    },
    // @method addHooks(): void
    // Add listener hooks to this handler.
    addHooks: function addHooks() {
        L.Draw.Feature.prototype.addHooks.call(this);
        if (this._map) {
            this._mapDraggable = this._map.dragging.enabled();

            if (this._mapDraggable) {
                this._map.dragging.disable();
            }

            //TODO refactor: move cursor to styles
            this._container.style.cursor = 'crosshair';

            this._tooltip.updateContent({ text: this._initialLabelText });

            this._map.on('mousedown', this._onMouseDown, this).on('mousemove', this._onMouseMove, this).on('mouseup', this._onMouseUp, this);
            //.on('touchstart', this._onMouseDown, this)
            //.on('touchmove', this._onMouseMove, this);
        }
    },
    // @method removeHooks(): void
    // Remove listener hooks from this handler.
    removeHooks: function removeHooks() {
        //L.Draw.Feature.prototype.removeHooks.call(this);
        if (this._map) {
            if (this._mapDraggable) {
                this._map.dragging.enable();
            }

            //TODO refactor: move cursor to styles
            this._container.style.cursor = '';

            this._map.off('mousedown', this._onMouseDown, this).off('mousemove', this._onMouseMove, this).off('mouseup', this._onMouseUp, this);
            //.off('touchstart', this._onMouseDown, this)
            //.off('touchmove', this._onMouseMove, this);

            L.DomEvent.off(document, 'mouseup', this._onMouseUp, this);
            //L.DomEvent.off(document, 'touchend', this._onMouseUp, this);

            // If the box element doesn't exist they must not have moved the mouse, so don't need to destroy/return
            if (this._shape) {
                this._map.removeLayer(this._shape);
                delete this._shape;
            }
            if (this._line) {
                this._map.removeLayer(this._line);
                delete this._line;
            }
        }
        this._isDrawing = false;
    }
});

L.Edit = L.Edit || {};

L.Edit.Arc = L.Edit.SimpleShape.extend({
    options: {
        moveIcon: new L.DivIcon({
            iconSize: new L.Point(8, 8),
            className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-move'
        }),
        resizeIcon: new L.DivIcon({
            iconSize: new L.Point(8, 8),
            className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-resize'
        }),
        startIcon: new L.DivIcon({
            iconSize: new L.Point(8, 8),
            className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-rotate'
        }),
        endIcon: new L.DivIcon({
            iconSize: new L.Point(8, 8),
            className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-rotate'
        }),
        rotateIcon: new L.DivIcon({
            iconSize: new L.Point(8, 8),
            className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-rotate'
        })
    },

    _initMarkers: function _initMarkers() {
        if (!this._markerGroup) {
            this._markerGroup = new L.LayerGroup();
        }
        this._resizeMarkers = [];

        // Create center marker
        this._createMoveMarker();

        // Create edge marker
        this._createResizeMarker();

        // Create start Marker();
        this._createStartMarker();

        // Create end Marker
        this._createEndMarker();

        //Create rotate Marker
        this._createRotateMarker();
    },

    _createMoveMarker: function _createMoveMarker() {
        var center = this._shape.getCenter();
        this._moveMarker = this._createMarker(center, this.options.moveIcon);
    },

    _createResizeMarker: function _createResizeMarker() {
        var bearing = (this._shape.getEndBearing() + this._shape.getStartBearing()) / 2,
            point = this._shape.computeDestinationPoint(this._shape.getCenter(), this._shape.getRadius(), bearing);

        this._resizeMarker = this._createMarker(point, this.options.resizeIcon);
    },

    _createStartMarker: function _createStartMarker() {
        var point = this._shape.computeDestinationPoint(this._shape.getCenter(), this._shape.getRadius(), this._shape.getStartBearing());

        this._startMarker = this._createMarker(point, this.options.startIcon);
    },

    _createEndMarker: function _createEndMarker() {
        var point = this._shape.computeDestinationPoint(this._shape.getCenter(), this._shape.getRadius(), this._shape.getEndBearing());

        this._endMarker = this._createMarker(point, this.options.endIcon);
    },

    _createRotateMarker: function _createRotateMarker() {
        var bearing = (this._shape.getEndBearing() + this._shape.getStartBearing()) / 2,
            point = this._shape.computeDestinationPoint(this._shape.getCenter(), this._shape.getRadius() * 1.3, bearing);

        this._rotateMarker = this._createMarker(point, this.options.rotateIcon);
    },

    _onMarkerDragStart: function _onMarkerDragStart(e) {
        L.Edit.SimpleShape.prototype._onMarkerDragStart.call(this, e);
        this._currentMarker = e.target;
    },

    _onMarkerDrag: function _onMarkerDrag(e) {
        var marker = e.target,
            latlng = marker.getLatLng();

        if (marker === this._moveMarker) {
            this._move(latlng);
        } else if (marker === this._resizeMarker) {
            this._resize(latlng);
        } else if (marker === this._startMarker) {
            this._restart(latlng);
        } else if (marker === this._endMarker) {
            this._end(latlng);
        } else {
            this._rotate(latlng);
        }

        this._shape.redraw();
    },

    _move: function _move(latlng) {
        this._shape.setCenter(latlng);
        this._shape.setLatLngs(this._shape.getLatLngs());

        // Move the resize marker
        this._repositionResizeMarker();
        this._repositionStartMarker();
        this._repositionEndMarker();
        this._repositionRotateMarker();
    },

    _resize: function _resize(latlng) {
        //let moveLatLng = this._moveMarker.getLatLng()
        var radius = this._shape.getCenter().distanceTo(latlng);

        this._shape.setRadius(radius);
        this._shape.setLatLngs(this._shape.getLatLngs());

        this._repositionStartMarker();
        this._repositionEndMarker();
        this._repositionResizeMarker();
        this._repositionRotateMarker();
    },

    _restart: function _restart(latlng) {
        var moveLatLng = this._shape.getCenter(),
            pc = this._map.project(moveLatLng),
            ph = this._map.project(latlng),
            v = [ph.x - pc.x, ph.y - pc.y],
            newB = Math.atan2(v[0], -v[1]) * 180 / Math.PI;

        this._shape.setStartBearing(newB);

        this._shape.setLatLngs(this._shape.getLatLngs());

        // Move the resize marker
        this._repositionResizeMarker();
        this._repositionStartMarker();
        this._repositionEndMarker();
        this._repositionRotateMarker();
    },

    _end: function _end(latlng) {
        var moveLatLng = this._shape.getCenter(),
            pc = this._map.project(moveLatLng),
            ph = this._map.project(latlng),
            v = [ph.x - pc.x, ph.y - pc.y],
            newB = Math.atan2(v[0], -v[1]) * 180 / Math.PI;

        this._shape.setEndBearing(newB);

        this._shape.setLatLngs(this._shape.getLatLngs());

        // Move the resize marker
        this._repositionResizeMarker();
        this._repositionEndMarker();
        this._repositionStartMarker();
        this._repositionRotateMarker();
    },

    _rotate: function _rotate(latlng) {
        var moveLatLng = this._shape.getCenter(),
            pc = this._map.project(moveLatLng),
            ph = this._map.project(latlng),
            v = [ph.x - pc.x, ph.y - pc.y],
            newB = Math.atan2(v[0], -v[1]) * 180 / Math.PI % 360,
            halfAngle = (this._shape.getEndBearing() - this._shape.getStartBearing()) / 2,
            newStart = newB - halfAngle,
            newEnd = newStart + 2 * halfAngle;

        this._shape.setStartBearing(newStart);
        this._shape.setEndBearing(newEnd);
        this._shape.setLatLngs(this._shape.getLatLngs());

        this._repositionResizeMarker();
        this._repositionEndMarker();
        this._repositionStartMarker();
        this._repositionRotateMarker();
    },

    _repositionResizeMarker: function _repositionResizeMarker() {
        var bearing = (this._shape.getEndBearing() + this._shape.getStartBearing()) / 2,
            point = this._shape.computeDestinationPoint(this._shape.getCenter(), this._shape.getRadius(), bearing);

        this._resizeMarker.setLatLng(point);
    },

    _repositionStartMarker: function _repositionStartMarker() {
        var start = this._shape.computeDestinationPoint(this._shape.getCenter(), this._shape.getRadius(), this._shape.getStartBearing());
        this._startMarker.setLatLng(start);
    },

    _repositionEndMarker: function _repositionEndMarker() {
        var end = this._shape.computeDestinationPoint(this._shape.getCenter(), this._shape.getRadius(), this._shape.getEndBearing());
        this._endMarker.setLatLng(end);
    },

    _repositionRotateMarker: function _repositionRotateMarker() {
        var bearing = (this._shape.getEndBearing() + this._shape.getStartBearing()) / 2;

        var point = this._shape.computeDestinationPoint(this._shape.getCenter(), this._shape.getRadius() * 1.3, bearing);

        this._rotateMarker.setLatLng(point);
    }
});

L.Arc.addInitHook(function () {
    if (L.Edit.Box) {
        this.editing = new L.Edit.Arc(this);

        if (this.options.editable) {
            this.editing.enable();
        }
    }

    this.on('add', function () {
        if (this.editing && this.editing.enabled()) {
            this.editing.addHooks();
        }
    });

    this.on('remove', function () {
        if (this.editing && this.editing.enabled()) {
            this.editing.removeHooks();
        }
    });
});

L.drawLocal.draw.toolbar.buttons.arc = 'Draw an Arc';

L.drawLocal.draw.handlers.arc = {
    tooltip: {
        start: 'Click to set Arc center.',
        line: 'Click to set Radius and Start Bearing.',
        end: 'Click to set End Bearing and create Arc'
    },
    radius: 'Radius (meters): ',
    bearing: 'Bearing (degrees): '
};
