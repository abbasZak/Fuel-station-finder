import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSnackbar } from 'notistack';
import { Icon } from 'leaflet';
import L from 'leaflet';
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

// Make sure these image imports are correct
import GasPump from './img/gas-pump.png';
import Marker2 from './img/location-pin.png';

const REVERSE_NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse?";

const gasIcon = new Icon({
  iconUrl: GasPump,
  iconSize: [38, 38]
});

const userIcon = new Icon({
  iconUrl: Marker2,
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
  const [currentPosition, setCurrentPosition] = useState(null);
  const [fillingData, setFillingData] = useState([]);
  const [reverseData, setReverseData] = useState(null);
  const [routingControl, setRoutingControl] = useState(null);
  const [stationLocations, setStationLocations] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const mapRef = useRef(null);

  const fetchCurrentPosition = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentPosition([latitude, longitude]);
          console.log("Current position set:", latitude, longitude);
        },
        (err) => {
          console.error("Geolocation error:", err);
          enqueueSnackbar("Error getting your location. Please ensure location services are enabled.", { variant: 'error' });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.warn("Geolocation is not supported");
      enqueueSnackbar("Geolocation is not supported by your browser", { variant: 'error' });
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
      return data;
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      enqueueSnackbar("Error fetching location details", { variant: 'error' });
      return null;
    }
  }, [enqueueSnackbar]);

  const fetchFillingStations = useCallback(async (lat, lon) => {
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="fuel"](around:5000,${lat},${lon});
        way["amenity"="fuel"](around:5000,${lat},${lon});
        relation["amenity"="fuel"](around:5000,${lat},${lon});
      );
      out body;
      >;
      out skel qt;
    `;
    
    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      });
      const data = await response.json();
      const fuelStations = data.elements.filter(element => element.type === 'node');
      setFillingData(fuelStations);

      // Fetch reverse geocoding data for each station
      const locations = {};
      for (const station of fuelStations) {
        const locationData = await fetchReverseGeocode(station.lat, station.lon);
        locations[station.id] = locationData;
      }
      setStationLocations(locations);
    } catch (err) {
      console.error("Filling station data fetch error:", err);
      enqueueSnackbar("Error fetching nearby fuel stations", { variant: 'error' });
    }
  }, [enqueueSnackbar, fetchReverseGeocode]);

  const checkRout = useCallback(async (id) => {
    const filterData = fillingData.find(station => station?.id === id);
    
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

  useEffect(() => {
    fetchCurrentPosition();
  }, [fetchCurrentPosition]);

  useEffect(() => {
    if (currentPosition) {
      fetchReverseGeocode(currentPosition[0], currentPosition[1]).then(data => setReverseData(data));
      fetchFillingStations(currentPosition[0], currentPosition[1]);
    }
  }, [currentPosition, fetchReverseGeocode, fetchFillingStations]);

  if (!currentPosition) {
    return <div>Loading your location...</div>;
  }

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

        <ZoomControl position="bottomright" />

        <SetView center={currentPosition} />

        <Marker 
          position={currentPosition}
          icon={userIcon}
        >
          <Popup>
            Your Location: {reverseData?.display_name}
          </Popup>
        </Marker>
        {fillingData.map((station) => (
          <Marker 
            key={station.id} 
            position={[station.lat, station.lon]} 
            icon={gasIcon}
            eventHandlers={{
              click: () => checkRout(station.id),
            }}
          >
            <Popup>
              {stationLocations[station.id]?.display_name || 'Loading location name...'}
              <br />
              Latitude: {station.lat}
              <br />
              Longitude: {station.lon}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;