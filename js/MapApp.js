
// The clinet id of Foursquare Api

var ClientId = "VX5PSXUIOX1EAWYWQ0ROR4URISXYY4ORNIFLTPUJYMYQIQOF";

// The Clinet Secret  of Foursquare Api

var ClinetSecret = "TOF4RFTDUPLZJFBYAPATIZXU20V1HOVSTA1DJT0EAIKMDJZ2&";
// var map content my inital map content

var map;
/* 
 ** This Function for change the style of marker
 ** the argumnt is the color of marker
 ** Return the image of new marker
*/
function ChangeMarkeStyle(Color) {
  var Image = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + Color +
    '|40|_|%E2%80%A2',
    new google.maps.Size(30, 40),
    new google.maps.Point(0, 0),
    new google.maps.Point(12, 40),
    new google.maps.Size(30, 40));
  return Image;
}

/* 
  ** array of Locations **
  ** content ( Title or name of lacation)
  ** content (location if object content lat and lng of the location)
*/
var LocationList = [
  {
    loc: { lat: 40.691194, lng: -73.989855 },
    title: 'New York Transit Museum'
  },
  {
    loc: { lat: 40.694871, lng: -73.980950 },
    title: 'New York City Housing Authority\'s Ingersoll Houses'
  },
  {
    loc: { lat: 40.694350, lng: -73.986572 },
    title: 'NYU Tandon School of Engineering'
  },
  {
    loc: { lat: 40.693301, lng: -73.983643 },
    title: 'Chase Bank'
  },
  {
    loc: { lat: 40.695725, lng: -73.987506 },
    title: 'New York City College of Technology'
  },
  {
    loc: { lat:40.694968, lng: -73.987452 },
    title: 'Kings County Family Court'
  },
  {
    loc: { lat:40.694573, lng: -73.984550 },
    title: 'FDNY Foundation'
  }

];
30.470423, 31.178656
/* 
  ** Location View Model **
  ** variables :
    *the location
    *palce name 
    *visiable
    *marker
  ** Info come from Api 
    *City Name
    *FaceBook
    *Country
    *Phone
  **method
    *ActionOCliclkMarker for on click list location action 
*/

var LocationModel = function (location) {

  var self = this;

  this.loc = location.loc;

  this.placeName = location.title;

  //this.PlaceApiInfo =  GetInfoFromApi(self.loc.lat, self.loc.lng, self.placeName);

  this.visiable = ko.observable(true);

  this.CityName = "";

  this.FaceBookName = "";

  this.Country = "";

  this.phone = "";

  this.FacebookUsername = "";

  // Url of The FourSquare Api 
  var url = "https://api.foursquare.com/v2/venues/search?"+"client_id="+ClientId + "&" +"client_secret="+ClinetSecret + "&"+"v=20130815&"+"ll="+self.loc.lat+","+self.loc.lng + "&"+"query="+self.placeName;
// Ajax for Get info from Api 
  $.ajax({

    url: url

    // When Get Data From Api Success

  }).done(function (data) {

    // get Info from api

console.log(data.response.venues[0]);
    self.CityName = data.response.venues[0].location.city;

    self.FaceBookName = data.response.venues[0].contact.facebookName;

    self.Country = data.response.venues[0].location.country;

    self.phone = data.response.venues[0].contact.phone;

    self.FacebookUsername = data.response.venues[0].contact.facebookUsername;
  
    // check if the data is not undefined 

    if (typeof self.CityName == 'undefined') {
      self.CityName = 'The City Name is Not Exit';
    }

    if (typeof self.FaceBookName == 'undefined') {
      self.FaceBookName = 'No FaceBook';
    }

    if (typeof self.Country == 'undefined') {
      self.Country = 'No Country';
    }

    if (typeof self.phone == 'undefined') {
      self.phone = 'No Phone';
    }

   // if fail get info from api 

  }).fail(function () {

    alert('Can not connected wirh the Foursquare api');

  });
  
  // create object of InfoWindow

  self.infowindow = new google.maps.InfoWindow();

  //var defaultIcon = makeMarkerIcon('0091ff');

  // Define marker for every Location

  self.marker = new google.maps.Marker({
    position: self.loc,
    map: map,
    title: self.placeName,
    //icon: ChangeMarkeStyle('21b121')
  });
  // if visiable marakers

  self.visiableMarker = ko.computed(function () {

    if (self.visiable() === true) {

      self.marker.setMap(map);

    } else {

      self.marker.setMap(null);
    }

    return true;

  }, self);
 // function for when click on the list loaction

  self.ActionOCliclkMarker = function () {

    infowindowcontent = `
        <div class="apiinfo">
            <h2>${self.placeName} </h2>
            <h3 class="CityName" >${self.CityName}</h3>
            <p class="country" >${self.Country}</p>
            <a href="https://www.facebook.com/${self.FacebookUsername}" class="facebook" >${self.FaceBookName}</a>
            <br>
            <p class="phone" >${self.phone}</p>
        </div>
    `;

    $('#mylist .apiinfo .CityName').text(self.CityName);
    $('#mylist .apiinfo .country').text(self.Country);
    $('#mylist .apiinfo .facebook').text(self.FaceBookName);
    $('#mylist .apiinfo .phone').text(self.phone);

    self.infowindow.setContent(infowindowcontent);

    self.infowindow.open(map, self.marker);

   // set animation for every marakers

    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    self.marker.setIcon(ChangeMarkeStyle('21b121'));
    setTimeout(() => {
      self.marker.setAnimation(null);
      self.marker.setIcon(null);
    }, 2000);

  };
  
  // when click the markers show the info window 

  self.marker.addListener('click', function () {

    infowindowcontent = `
                <div class="apiinfo">
                    <h2>${self.placeName} </h2>
                    <h3 class="CityName" >${self.CityName}</h3>
                    <p class="country" >${self.Country}</p>
                    <a href="https://www.facebook.com/${self.FacebookUsername}" class="facebook" >${self.FaceBookName}</a>
                    <br>
                    <p class="phone" >${self.phone}</p>
                </div>
            `;
    
    $('#mylist .apiinfo .CityName').text(self.CityName);
    $('#mylist .apiinfo .country').text(self.Country);
    $('#mylist .apiinfo .facebook').text(self.FaceBookName);
    $('#mylist .apiinfo .phone').text(self.phone);

    self.infowindow.setContent(infowindowcontent);

    self.infowindow.open(map, self.marker);

    self.marker.setAnimation(google.maps.Animation.BOUNCE);


    setTimeout(() => {
      self.marker.setAnimation(null);
    }, 2000);

  });

};
/* 
   ** Map View Model **
     ** variables ( LocationInputName , LocationList (array) )
     ** Functions ( GetFilterPlaces for filter the places from text input)
*/
var MapViewModel = function () {

  var self = this;

  this.LocationInputName = ko.observable("");

  this.LocationList = ko.observableArray([]);

  for (var i = 0; i < LocationList.length; i++) {

    this.LocationList.push(new LocationModel(LocationList[i]));
  }
   
  this.GetFilterPlaces = function () {

    LocationInput = self.LocationInputName().toUpperCase();

    for (var i = 0; i < self.LocationList().length; i++) {

      list_location = self.LocationList()[i].placeName.toUpperCase();

      if (list_location.search(LocationInput) >= 0) {

        self.LocationList()[i].visiable(true);


      }
      else {

        self.LocationList()[i].visiable(false);

      }
    }

  };



};

// this function for inital the map api

function initMap() {
  map = new google.maps.Map(document.getElementById('mymap'), {
    zoom: 16,
    center: { lat: 40.694167, lng:-73.983939 },
  });

  ko.applyBindings(new MapViewModel());

}

function ErrorMapHandel(){

  alert('Same Thing Is error On Load Map');

}

// function GetInfoFromApi(lat, lng, PlaceName) {

//   var ClientId = "VX5PSXUIOX1EAWYWQ0ROR4URISXYY4ORNIFLTPUJYMYQIQOF";

//   var ClinetSecret = "TOF4RFTDUPLZJFBYAPATIZXU20V1HOVSTA1DJT0EAIKMDJZ2&";

//   // var Url = "https://api.foursquare.com/v2/venues/search?"
//   //            + "client_id="+ClientId+"&client_secret="+ClinetSecret+
//   //            "&v=20130815&ll="+lat+","+lng+"&query="+PlaceName;


// var info ;
//   $.ajax({

//       url: url

//     }).done(function(data){

//       //  info = data.response.venues[0].location;

//     }).fail(function () {

//     alert('Can not connected wirh the Foursquare api');

//     //return false;
//   });

//   return info;
// }

//  //console.log( GetInfoFromApi(30.296834,31.746217,'Banque Misr'));