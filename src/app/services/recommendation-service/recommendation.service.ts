import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user-service/user.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { Recommendation } from 'src/app/models/recommendation';


@Injectable({
  providedIn: 'root'
})
export class RecommendationService{
    /**
* Initializing driverRay as an array that has User objects
*/
  driverRay: User[];
  /**
* Initializing driverRec as an object that has a User object and set other params
*/
  driverRec: Recommendation;
    /**
* Initializing driverRecs as an array of recomendations
*/
  driverRecs: Recommendation[];
  /**
   * Constructor 
   * @param userService An user service is instantiated.
   * @param authService An auth service is injected.
   */
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

 /**
   * Function: generates a given driver's recommendation points based on the following params:
   * @param driver the driver User object
   * @param time duration of drive
   * @param seats the number of open seats in the vehicle
   */
  generateRecPoints(driver: User, distance: number, time: number, seats: number): Recommendation {

      this.driverRec = new Recommendation;
      this.driverRec.driver = driver;
      this.driverRec.disPoints = (1 / distance) * 1000;
      this.driverRec.timePoints = (1 / time) * 1000;
      this.driverRec.seatPoints = seats * 1000;
      this.driverRecs.push(this.driverRec)
    return this.driverRec;
  }

}
