import { User } from './user';

export class Recommendation {
    driver : User;
    disPoints: number;
    timePoints: number;
    seatPoints: number;
    recPoints: number = 
    (this.disPoints + this.timePoints + this.seatPoints)
}
