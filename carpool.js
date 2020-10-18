'use strict';
// Create the script tag, set the appropriate attributes
let script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDC9vuN0XPq_N-glaLd3ppqV2Y9o8E1m5M&callback=initMap';
script.defer = true;

let map;
let form = document.getElementById("myForm");
let startAddress = document.getElementById("start");
let endingAddress = document.getElementById("end");
let stops = document.getElementById("stops");
let result = document.getElementById("output");
let submittedStartAddress;
let submittedEndAddress;
let submittedStops;
let service; 

let commonPlaces = new Map();

commonPlaces['UT Austin'] = 'UT Austin';
commonPlaces["Austin Stone Downtown"] = "1715 W Cesar Chavez St, Austin, TX, 78703";
commonPlaces["Gateway Community Church"] = "5600 Sunshine Dr, Austin, TX, 78756";
commonPlaces["Life Church"] = "5925 Dillard Circle, Austin, TX, 78752";
commonPlaces["Austin Ridge Bible Church"] = "7416 W, TX-71, Austin, TX, 78735";
commonPlaces["Shoreline Church"] = "15201 Burnet Rd, Austin, TX, 78728";
commonPlaces["Celebration Church"] = "601 Westinghouse Rd, Georgetown, TX, 78626";
commonPlaces["Hyde Park Baptist Church"] = "3901 Speedway, Austin, TX, 78751";
commonPlaces['Great Hills Baptist Church'] = "10500 Jollyville Rd, Austin, TX, 78759";
commonPlaces['Jester West'] = "201 E 21st St Austin, TX, 78705";
commonPlaces['Kinsolving'] = '2605 Whitis Ave, Austin, TX, 78705';
commonPlaces['Moore Hill'] = '204 E 21st St, Austin, TX, 78705';
commonPlaces['Jester East'] = '201 E 21st St, Austin, TX, 78705';
commonPlaces['Prather'] = '305 E 21st St, Austin, TX, 78712';
commonPlaces['San Jacinto'] = '309 E 21st St Austin, TX, 78712';




// Attach your callback function to the `window` object
window.initMap = function() {
  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();
  // add the map 
  map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 30.2849 , lng: -97.7341},
  zoom: 12
  });
  directionsRenderer.setMap(map);
  form.addEventListener("submit", (e) => {
    calculateAndDisplayRoute(e, directionsService, directionsRenderer);
  });
};

function calculateAndDisplayRoute(e, directionsService, directionsRenderer){
  e.preventDefault();
  submittedStartAddress = startAddress.value;
  submittedEndAddress = endingAddress.value;
  submittedStops = stops.value.split("\n");
  // Check if the entered address is equal to one of our common places
  /* if (commonPlaces[submittedStartAddress] != undefined) {
    submittedStartAddress = commonPlaces[submittedStartAddress]; 
  }
  if (commonPlaces[submittedEndAddress] != undefined) {
    submittedEndAddress = commonPlaces[submittedEndAddress];
  }
  for (let i = 0; i < submittedStops.length; i++) {
    if (commonPlaces[submittedStops[i]] != undefined) {
      submittedStops[i] = commonPlaces[submittedStops[i]];
    }
  }*/   

  let origin = submittedStartAddress;
  let destinationA = submittedEndAddress;
  let wayPoints = [];
  for (let i = 0; i < submittedStops.length; i++) {
    wayPoints.push({
      location: submittedStops[i],
      stopover: true,
    });
  }
  directionsService.route(
    {
      origin: origin,
      destination: destinationA, // 4011 Bountiful Crest Ln, Sugar Land, TX 77479
      
      travelMode: google.maps.TravelMode.DRIVING,
      // transitOptions: TransitOptions,
      // drivingOptions: DrivingOptions,
      // unitSystem: 'IMPERIAL',
      waypoints: wayPoints,
      optimizeWaypoints: true
      //avoidHighways: false,
      // avoidTolls: false,
    }, 
    (response, status) => {
      console.log(response);
      if (status === "OK") {
        directionsRenderer.setDirections(response);
        removeAllChildNodes(result);
        for (let x = 0; x < response.routes.length; x++){
          const route = response.routes[x];
          let summaryPanel = document.createElement("p");
          summaryPanel.innerHTML = "";
          
          let totalDistance = 0;
          let totalTime = 0;
          // For each route, display summary information.
          for (let i = 0; i < route.legs.length; i++) {
            const routeSegment = i + 1;
            // const wayPointsOptimized = route.request.waypoints;
            summaryPanel.innerHTML += 
            "<b>Route Segment: " + routeSegment + "</b><br>";
            summaryPanel.innerHTML += getKeyByValue(commonPlaces, route.legs[i].start_address)+ "<br> to ";
            // for(let i = 0; i < wapPointsOptimized.length; i++){

            // }
            summaryPanel.innerHTML += getKeyByValue(commonPlaces, route.legs[i].end_address) + "<br>";
            summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
            summaryPanel.innerHTML += route.legs[i].duration.text + "<br><br>";

            totalDistance += route.legs[i].distance.value;
            totalTime += route.legs[i].duration.value;
          }
          
          summaryPanel.innerHTML += "Total Distance: " + Math.round(totalDistance / 100 / 1.609) /10 + " mi<br>";
          summaryPanel.innerHTML += "Total Time: " + Math.floor(totalTime / 3600) + " hour(s) and " + Math.round(totalTime % 3600 / 60) + " min";
          result.appendChild(summaryPanel);
        }
      } else {
        window.alert("Directions request failed due to " + status);
      }
    });
}

// Append the 'script' element to 'head'
document.head.appendChild(script);

function getKeyByValue(object, value) {
  console.log(value);
  let ret = Object.keys(object).find(key => object[key] === value);
  console.log(ret);
  if(ret == undefined){
    return value;
  }
  return ret;
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}


/* Returns all possible routes. 
function getAllRoutes (inputArr) {
  let result = [];
  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next))
      }
    }
  }
  permute(inputArr)
  return result;
}*/



  







