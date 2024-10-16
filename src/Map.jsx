import { MapContainer, TileLayer, Marker, useMap, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { Icon } from 'leaflet';
import GasPump from './img/gas-pump.png';
import L from 'leaflet';
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search?";
const REVERSE_NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse?";

const gasIcon = new Icon({
  iconUrl: GasPump,
  iconSize: [38, 38]
});

function SetView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

function Map() {
  const [currentPosition, setCurrentPosition] = useState([51.505, -0.09]);
  const [fillingData, setFillingData] = useState([]);
  const [reverseData, setReverseData] = useState(null);
  const [routingControl, setRoutingControl] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const mapRef = useRef(null);

  const fetchCurrentPosition = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentPosition([latitude, longitude]);
        },
        (err) => {
          console.error("Geolocation error:", err);
          enqueueSnackbar(err.message, { variant: 'error' });
        }
      );
    } else {
      console.warn("Geolocation is not supported");
      enqueueSnackbar("Geolocation is not supported", { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  const fetchReverseGeocode = useCallback(async (lat, lon) => {
    const params = new URLSearchParams({
      format: "json",
      lat,
      lon,
      zoom: 18,
      addressdetails: 1
    });

    try {
      const response = await fetch(`${REVERSE_NOMINATIM_URL}${params}`);
      const data = await response.json();
      setReverseData(data);
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  const fetchFillingStations = useCallback(async (city) => {
    const params = new URLSearchParams({
      q: `filling station ${city}`,
      format: "json",
      addressdetails: 1,
      polygon_geojson: 0,
      limit: 10
    });

    try {
      const response = await fetch(`${NOMINATIM_URL}${params}`);
      const data = await response.json();
      setFillingData(data);
    } catch (err) {
      console.error("Filling station data fetch error:", err);
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchCurrentPosition();
  }, [fetchCurrentPosition]);

  useEffect(() => {
    if (currentPosition[0] !== 51.505 || currentPosition[1] !== -0.09) {
      fetchReverseGeocode(currentPosition[0], currentPosition[1]);
    }
  }, [currentPosition, fetchReverseGeocode]);

  useEffect(() => {
    if (reverseData?.address?.city) {
      fetchFillingStations(reverseData.address.city);
    }
  }, [reverseData, fetchFillingStations]);

  const checkRout = useCallback((id) => {
    const filterData = fillingData.find(station => station?.osm_id === id);
    if (filterData && mapRef.current) {
      if (routingControl) {
        mapRef.current.removeControl(routingControl);
      }
      
      const newRoutingControl = L.Routing.control({
        waypoints: [
          L.latLng(currentPosition[0], currentPosition[1]),
          L.latLng(filterData.lat, filterData.lon)
        ],
        routeWhileDragging: true
      }).addTo(mapRef.current);
      
      setRoutingControl(newRoutingControl);
    }
  }, [fillingData, currentPosition, routingControl]);

  return (
    <div className="w-full h-full">
      <MapContainer 
        center={currentPosition} 
        zoom={13} 
        className="h-screen" 
        style={{ height: '100vh' }}
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          url="https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}@2x.png?key=6znPEstwbdDf8ymGneHk"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <ZoomControl position="bottomright" /> {/* You can change the position here */}


        <SetView center={currentPosition} />

        <Marker position={currentPosition}>
          <Popup>
            {reverseData?.display_name}
          </Popup>
        </Marker>
        {fillingData.map((station) => (
          station.lat && station.lon ? (
            <Marker 
              key={station.osm_id} 
              position={[parseFloat(station.lat), parseFloat(station.lon)]} 
              icon={gasIcon}
              eventHandlers={{
                click: () => checkRout(station.osm_id),
              }}
            >
              <Popup>
                {station?.display_name}
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;