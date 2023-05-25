import React, { useState } from "react";

import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Marker,
  Popup,
  useMap,
  GeoJSON,
  Polygon,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useRef, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";

const NewMap = () => {
  const locationIcon = L.icon({
    iconUrl: "https://i.imgur.com/9e83qzH.png",
    iconSize: [40, 60],
    iconAnchor: [15, 30],
  });
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState([50.0503606, 19.9600723]);

  const [mapLayers, setMapLayers] = useState([]);

  const ZOOM_LEVEL = 12;
  const mapRef = useRef();

  const _onCreate = (e) => {
    console.log(e);

    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const { _leaflet_id } = layer;

      setMapLayers((layers) => [
        ...layers,
        { id: _leaflet_id, latlngs: layer.getLatLngs()[0] },
      ]);
    }
  };

  const _onEdited = (e) => {
    console.log(e);
    const {
      layers: { _layers },
    } = e;

    Object.values(_layers).map(({ _leaflet_id, editing }) => {
      setMapLayers((layers) =>
        layers.map((l) =>
          l.id === _leaflet_id
            ? { ...l, latlngs: { ...editing.latlngs[0] } }
            : l
        )
      );
    });
  };

  const _onDeleted = (e) => {
    console.log(e);
    const {
      layers: { _layers },
    } = e;

    Object.values(_layers).map(({ _leaflet_id }) => {
      setMapLayers((layers) => layers.filter((l) => l.id !== _leaflet_id));
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetch(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setPosition([lat, lon]);
        }
      });
  };

  const MapMoveTo = ({ position }) => {
    const map = useMap();
    map.setView(position, map.getZoom());
    return null;
  };

  async function handleClick() {
    try {
      const data = {
        polygon: mapLayers,
      };

      const response = await fetch(`API_URL`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer API_TOKEN`,
        },
        body: JSON.stringify({ data }),
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  const [polygonData, setPolygonData] = useState(null);
  const [data, setData] = useState(null);

  return (
    <>
      <div className="row">
        <div className="col text-center">
          <h2>React-leaflet - Create, edit and delete polygon on map</h2>
          <form onSubmit={handleSearch}>
            <label>
              Find Address:
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
            <button type="submit">Search</button>
          </form>

          <div className="col">
            <MapContainer
              center={position}
              zoom={ZOOM_LEVEL}
              ref={mapRef}
              style={{ height: "600px", width: "100vh", marginLeft: "20px" }}
            >
              {mapLayers.map((layer) => (
                <Polygon key={layer.id} positions={layer.latlngs} />
              ))}
              <FeatureGroup>
                <EditControl
                  position="topright"
                  onCreated={_onCreate}
                  onEdited={_onEdited}
                  onDeleted={_onDeleted}
                  draw={{
                    rectangle: false,
                    polyline: false,
                    circle: false,
                    circlemarker: false,
                    marker: false,
                  }}
                />
              </FeatureGroup>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position} icon={locationIcon}>
                <Popup>Restaurant Location</Popup>
              </Marker>
              <MapMoveTo position={position} />
              {data && data.coordinates && (
                <GeoJSON
                  data={{
                    type: "Feature",
                    geometry: {
                      type: "Polygon",
                      coordinates: data.coordinates,
                    },
                  }}
                  style={{ color: "red" }}
                />
              )}
            </MapContainer>

            <button onClick={handleClick}>Update Map Layers</button>
            <div style={{ height: "200px", overflowY: "scroll" }}>
              <pre className="text-left">{JSON.stringify(mapLayers, 0, 2)}</pre>
              <h1>My Component</h1>
              {data ? <p>{JSON.stringify(data)}</p> : <p>Loading data...</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  col: {
    display: "flex",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "95%",
    alignSelf: "center",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "95%",
    alignSelf: "center",
    flexDirection: "column",
  },
};

export default NewMap;
