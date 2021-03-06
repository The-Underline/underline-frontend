import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import {
	Map,
	Marker,
	Popup,
	TileLayer,
	Polyline,
	Circle,
	Polygon,
	Rectangle,
} from "react-leaflet";
import { Sidebar, Tab } from "react-leaflet-sidetabs";
import { FiHome, FiChevronRight, FiSearch, FiSettings } from "react-icons/fi";
import { popup } from "leaflet";
import {
	Navbar,
	Nav,
	NavDropdown,
	Form,
	FormControl,
	Button,
	Container,
	Row,
	Col,
	Card,
} from "react-bootstrap";
import TemporaryDrawer from "../Compononents/TemporaryDrawer";
import Control from "react-leaflet-control";
import L from "leaflet";
import axios from "axios";
import music_event from "../Images/guitar-solid.png"
import art_event from "../Images/paint-brush-solid.png"
import Event from "../Compononents/Event";
import Events from "../Compononents/Events";
//import Events from "material-ui/utils/events";
//import Events from "./Events"

function GetIcon(_iconSize, typeIcon) {
	return L.icon({
		iconUrl: require("../Images/" + typeIcon + ".png"),
		iconSize: [_iconSize],
	});
}

function Maps({ toggleDrawer, state, button, submitEvent }) {
	const [collapsed, setCollapsed] = useState(true);
	const [selected, setSelected] = useState("home");
	const [coordinates, setCoords] = useState([0,0]);
	const [isInPoly, setInPoly] = useState(false);
	const [displayMarker, setDisplayMarker] = useState(false)
	const handleClick = (e) =>
    {
      if(isInPoly === true)
      {
        setCoords(e.latlng); 
        console.log(coordinates);
      }
    }
    const handlePolyClick = () =>
  {
    setInPoly(true);
    setDisplayMarker(true);
    setTimeout(() => 
    {
      setInPoly(false);
    }, 100);
  }

	const onClose = () => {
		setCollapsed(true);
	};

	const onOpen = (id) => {
		setCollapsed(false);
		setSelected(id);
	};

	const [events, setEvents] = useState([]);

	const renderEvents = async () => {
		try {
			let res = await axios.get(
				"https://sparkdev-underline.herokuapp.com/events/find/all"
			);
			let e = res.data.events;

      setEvents(e);
      
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		renderEvents();
	}, []);

	//console.log("This is the value of events: " ,events); //error
	//console.log("This is the value of event: " , event.location)

	const locations = [
		{ name: "icon1", position: [1, 2], typeIcon: "Restrooms" },
		{ name: "icon2", position: [25.76421, -80.1953], typeIcon: "food" },
		{ name: "icon2", position: [25.76521, -80.19541], typeIcon: "athletic" },
	];

	var position = [25.763, -80.195];
	var zoomLevel = 17;
	return (
		<div id="maps">
			<Map
				center={position}
				zoom={zoomLevel}
				onclick={handleClick}
				zoomControl={false}
				attributionControl={false}
			>
				<link
					rel="stylesheet"
					href="https://unpkg.com/leaflet@1.0.1/dist/leaflet.css"
				/>
				<TileLayer
					url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
					attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
					id=""
					accessToken=""
				/>
				<Polygon
					positions={[
						[25.7664, -80.1957],
						[25.7664, -80.1954],
						[25.7625, -80.1952],
						[25.7625, -80.1955],
					]}
					//color="blue"
					fillColor="green"
					weight={2}
					opacity={0.01} //Outline color
          fillOpacity={0.4}
          onclick={handlePolyClick}
				/>
        {displayMarker === true ? <Marker position={coordinates} onclick={toggleDrawer('left', true, 'createEventButton')}/> : null}
        {events.map((event) => {

          let iconName = 'Restrooms';

          if (event.tag === 'sporting_events') {
            iconName = 'athletic';
          } else if (event.tag === 'food_events') {
            iconName = 'food';
          } else if (event.tag === 'art_expo') {
            iconName = 'paint-brush-solid';
          } else if (event.tag === 'music_show') {
            iconName = 'guitar-solid';
          } else  {
            iconName = 'Restrooms';
          }
          

          return(
            <Marker
				icon={GetIcon(40, iconName)}
				position={[event.location.latitude, event.location.longitude]} key={event.event_id}
			>
				<Popup>
					<b>{event.title}</b> <br /> {event.description}
				</Popup>
			</Marker>
          )
        })}

				<Control position="topleft">
					<TemporaryDrawer
						toggleDrawer={toggleDrawer}
						state={state}
						button={button}
						coordinates={coordinates}
					/>
				</Control>
			</Map>
		</div>
	);
}

export default Maps;
