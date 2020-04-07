import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { CarService } from 'src/app/services/car-service/car.service';
import { HttpClient } from '@angular/common/http';
import { GoogleService } from 'src/app/services/google-service/google.service';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent implements OnInit {
  //public driverUsers: User[];
  //public userSeats: number[] = new Array();

  homeLocation: string = '';
  workLocation: string = '';
  mapProperties: {};
  availableCars: Array<any> = [];
  drivers: Array<any> = [];
  driversList: Array<any> = [];
  distance: Array<any> = [];
  time: Array<any> = [];
  range: number = 5;
  sameOffice: boolean = true;
  numOfPages: number;
  currentPage: number;
  amountOnPage: number = 5;
  pageButtonArray: Array<string> = [];


  @ViewChild('map', null) mapElement: any;
  map: google.maps.Map;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private googleService: GoogleService,
    private carService: CarService,
    private _ngZone: NgZone
  ) { }

  ngOnInit() {

    //Retriving

    console.log("User Id: " + sessionStorage.getItem('userid'));
    console.log("Home: " + sessionStorage.getItem('hAddress'));
    console.log("Work: " + sessionStorage.getItem('wAddress'));

    this.homeLocation = sessionStorage.getItem('hAddress');
    this.workLocation = sessionStorage.getItem('wAddress');

    this.googleService.getGoogleApi();

    this.searchDriver();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  searchDriver() {
    this.currentPage = 0;
    //call service search algorithm ()
    console.log("Searching for Drivers");
    console.log("Range " + this.range);
    console.log("Same Office " + this.sameOffice);
    this.drivers = [];

    this.userService.getRidersForLocation1(this.homeLocation, this.workLocation, this.range, this.sameOffice).subscribe(
      async res => {
        res.forEach(async element => {
          let driver = {
            'id': element.userId,
            'name': element.firstName + " " + element.lastName,
            'origin': element.hAddress + "," + element.hCity + "," + element.hState,
            'email': element.email,
            'phone': element.phoneNumber,
            'car': null
          };
          this.carService.getCarByUserId3(element.userId).subscribe(
            resp=>{driver.car = resp;}
          )
          this.drivers.push(driver);
        });

        this.emptyDriversList();

        this.displayDriversList(this.homeLocation, this.drivers);

      });


    //get all routes
    this.sleep(2000).then(() => {
      let self = this;
      this._ngZone.runOutsideAngular(() => {
        self.mapProperties = {
          center: new google.maps.LatLng(Number(sessionStorage.getItem("lat")), Number(sessionStorage.getItem("lng"))),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        self.map = new google.maps.Map(self.mapElement.nativeElement, self.mapProperties);
      });
      //empty drivers list
      //show drivers on map
      this.showDriversOnMap(this.homeLocation, this.drivers);
    });

  }

  showDriversOnMap(origin, drivers) {
    drivers.forEach(element => {
      var directionsService = new google.maps.DirectionsService;
      var directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: true,
        map: this.map
      });
      this.displayRoute(origin, element.origin, directionsService, directionsRenderer);
    });
  }


  displayRoute(origin, destination, service, display) {
    this._ngZone.runOutsideAngular(() => {
      service.route({
        origin: origin,
        destination: destination,
        travelMode: 'DRIVING',
        //avoidTolls: true
      }, function (response, status) {
        if (status === 'OK') {
          display.setDirections(response);
        } else {
          if(status !== 'OVER_QUERY_LIMIT'){
            alert('Could not display directions due to: ' + status);
          }
        }
      });
    });
  }

  displayDriversList(origin, drivers) {
    let list = [];
    let distance = [];
    let time = [];

    let origins = [];
    //set origin
    origins.push(origin);
    var outputDiv = document.getElementById('output');
    this.drivers.forEach(async element => {

      // this.sleep(2000).then(() => {
      var service = new google.maps.DistanceMatrixService;
      this._ngZone.runOutsideAngular(() => {
        service.getDistanceMatrix(
          {
            origins: origins,
            destinations: [element.origin],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.IMPERIAL,
            avoidHighways: false,
            avoidTolls: false
          }, callback);
      });

      function callback(response, status) {
        if (status !== 'OK') {
          alert('Google API Error: ' + status);
        } else {
          var originList = response.originAddresses;
          var destinationList = response.destinationAddresses;
          var results = response.rows[0].elements;

          console.log("Element After " + element.name);
          list.push(element);
          distance.push(results[0].distance);
          time.push(results[0].duration);
          var name = element.name;
          console.log(element.car)
        }
      }



    });

    this.time = time;
    this.distance = distance;
    this.driversList = list;

    this.sleep(1000).then(()=>{this.fillTable();})

  }

  fillTable(){
    this.emptyDriversList();
    this.numOfPages = Math.ceil(this.driversList.length / this.amountOnPage);
    var outputDiv = document.getElementById('output');
    let startingIndex = this.currentPage * this.amountOnPage;
    console.log('startingIndex = ' + startingIndex)

    // <td class="col">${(this.time[i].text).replace('days','d').replace('day','d').replace('hours','h').replace('hour','h').replace('mins','m').replace('min','m')}</td>

    for(let i=startingIndex;i<this.driversList.length && i<(startingIndex + this.amountOnPage);i++){
      console.log('------------------------------- i = ' + i)
      outputDiv.innerHTML += `<tr><td class="col">${this.driversList[i].name}</td>
          <td class="col">${this.distance[i].text}</td>
          <td class="col">${this.time[i].text}</td>
          <td class="col">${this.driversList[i].car ? this.driversList[i].car.seats : 0}</td>
          <td class="col">
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCentered${this.driversList[i].id}"> View</button>
            <div class="col-lg-5">
            <div class="modal " id="exampleModalCentered${this.driversList[i].id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenteredLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered" role="document">
                  <div class="modal-content ">
                      <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalCenteredLabel">Contact Info:</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                          </button>
                      </div>
                      <div class="modal-body">
                      <h1 style="color: #f16a2c;">${this.driversList[i].name}</h1>
                      <span class="text-muted">Email: </span><h3>${this.driversList[i].email}</h3>
                      <span class="text-muted">Phone: </span><h3>${this.driversList[i].phone}</h3>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                      </div>
                    </div>
                </div>
              </div>
          </div>
          <div class="col-lg-6">
              <div #maps id="gmap" class="img-responsive"></div>
          </div>
        </td></tr>`;
    }

    let startingPage = this.currentPage >= 2 ? this.currentPage - 1 : 0;
    this.pageButtonArray = [];

    if(this.currentPage >= 2){
      this.pageButtonArray.push('First');
    }if(this.currentPage !== 0){
      this.pageButtonArray.push('Prev');
    }

    for(let i=startingPage;i<this.numOfPages && i<this.currentPage + 2;i++){
      this.pageButtonArray.push(String(i + 1));
    }

    if(this.numOfPages > this.currentPage + 1){
      this.pageButtonArray.push('Next')
    }
    if(this.numOfPages - this.currentPage >= 3){
      this.pageButtonArray.push('Last')
    }

    console.log('------------pageButtonArray--------------');
    console.log(this.pageButtonArray);

  }

  changePage(p: string){
    console.log('------------in the function--------------');
    switch(p){
      case 'First':
        this.currentPage = 0; break;
      case 'Next':
        this.currentPage += 1; break;
      case 'Prev':
        this.currentPage -= 1; break;
      case 'Last':
        this.currentPage = this.numOfPages - 1; break;
      default:
        this.currentPage = Number(p) - 1;
    }
    this.fillTable();
  }

  emptyDriversList() {
    var outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ``;
  }

  sortByName() {
    console.log("Sorting By Name");
    this.emptyDriversList();

    console.log(this.driversList);
    console.log(this.time);
    console.log(this.distance);

    let dr = [];
    //CREATE ARRAY OF NAMES.
    this.driversList.forEach(d => { dr.push(d.name); })
    console.log("Unsorted: " + dr);

    const drClone = Object.assign([], dr);
    console.log("Clone: " + drClone);


    let sortDr = dr.sort();
    console.log(sortDr);

    let index = [];
    sortDr.forEach(s => { index.push(drClone.indexOf(s)); });
    console.log(index);
    let tempDistance: Array<any> = [];
    let tempTime: Array<any> = [];
    let tempDriverList: Array<any> = [];

    let mark = 0;
    sortDr.forEach(sDr => {
      tempDistance.push(this.distance[index[mark]]);
      tempTime.push(this.time[index[mark]]);
      tempDriverList.push(this.driversList[index[mark]]);
      mark++
    })

    this.distance = tempDistance;
    this.time = tempTime;
    this.driversList = tempDriverList;
    this.fillTable();
  }

  sortByDistance() {
    this.emptyDriversList();

    console.log(this.driversList);
    console.log(this.time);
    console.log(this.distance);

    let ds = [];
    //CREATE ARRAY OF Distances. 
    this.distance.forEach(d => { ds.push(Number(d.value)); })
    console.log("Unsorted: " + ds);

    const dsClone = Object.assign([], ds);
    console.log("Clone: " + dsClone);

    let sortDs = ds.sort((a, b) => a - b); // For ascending sort
    console.log(sortDs);

    let index = [];
    sortDs.forEach(s => { index.push(dsClone.indexOf(s)); });
    console.log(index);
    let tempDistance: Array<any> = [];
    let tempTime: Array<any> = [];
    let tempDriverList: Array<any> = [];

    let mark = 0;
    var outputDiv = document.getElementById('output');
    sortDs.forEach(sDr => {
      tempDistance.push(this.distance[index[mark]]);
      tempTime.push(this.time[index[mark]]);
      tempDriverList.push(this.driversList[index[mark]]);
      mark++;
    })

    this.distance = tempDistance;
    this.time = tempTime;
    this.driversList = tempDriverList;

    this.fillTable();
  }

  sortByTime() {
    this.emptyDriversList();

    console.log(this.driversList);
    console.log(this.time);
    console.log(this.distance);

    let ds = [];
    //CREATE ARRAY OF Distances. 
    this.time.forEach(d => { ds.push(Number(d.value)); })
    console.log("Unsorted: " + ds);

    const dsClone = Object.assign([], ds);
    console.log("Clone: " + dsClone);

    let sortDs = ds.sort((a, b) => a - b); // For ascending sort
    console.log(sortDs);

    let index = [];
    sortDs.forEach(s => { index.push(dsClone.indexOf(s)); });
    console.log(index);
    let tempDistance: Array<any> = [];
    let tempTime: Array<any> = [];
    let tempDriverList: Array<any> = [];

    let mark = 0;
    var outputDiv = document.getElementById('output');
    sortDs.forEach(sDr => {
      tempDistance.push(this.distance[index[mark]]);
      tempTime.push(this.time[index[mark]]);
      tempDriverList.push(this.driversList[index[mark]]);
      mark++;
    })

    this.distance = tempDistance;
    this.time = tempTime;
    this.driversList = tempDriverList;

    this.fillTable();
  }

  sortBySeats() {
    this.emptyDriversList();

    console.log(this.driversList);
    console.log(this.time);
    console.log(this.distance);

    let ds = [];
    //CREATE ARRAY OF Distances.
    this.driversList.forEach(d => {ds.push(d);});
    console.log("Unsorted: ");
    console.log(ds);

    const dsClone = Object.assign([], ds);
    console.log("Clone: " + dsClone);

    let sortDs = ds.sort((a, b) => (b.car ? b.car.seats : 0) - (a.car ? a.car.seats : 0)); // For descending sort
    console.log(sortDs);

    let index = [];
    sortDs.forEach(s => { index.push(dsClone.indexOf(s)); });
    console.log(index);
    let tempDistance: Array<any> = [];
    let tempTime: Array<any> = [];
    let tempDriverList: Array<any> = [];

    let mark = 0;
    var outputDiv = document.getElementById('output');
    sortDs.forEach(sDr => {
      tempDistance.push(this.distance[index[mark]]);
      tempTime.push(this.time[index[mark]]);
      tempDriverList.push(this.driversList[index[mark]]);
      mark++;
    })
    
    this.distance = tempDistance;
    this.time = tempTime;
    this.driversList = tempDriverList;

    this.fillTable();
  }

}
