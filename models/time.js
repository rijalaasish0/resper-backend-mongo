class Time {
    constructor(){
        this.timeMap = new Map();
    }

    checkInUser(username, restaurantID, checkInTime){
        if(this.timeMap.has(restaurantID + "_" + username)){
            return 0;
        }
        this.timeMap.set(restaurantID + "_" + username, checkInTime);
        return 1;
    }

    checkOutUser(username, restaurantID, checkOutTime){
        if(this.timeMap.has(restaurantID + "_" + username)){
            const checkInTime = this.timeMap.get(restaurantID + "_" + username);
            const totalTimeWorked = checkOutTime - checkInTime;
            this.timeMap.delete(restaurantID + "_" + username);
            return totalTimeWorked;
        }else{
            return 0;
        }
    }

    getWeekNumber(){
        let currentDate = new Date(Date());
        let oneJan = new Date(currentDate.getFullYear(), 0, 1);
        let numberOfDays = Math.floor((currentDate - oneJan) / (24 * 60 * 60 * 1000));
        let result = Math.ceil( (currentDate.getDay() + 1 + numberOfDays)/7 );
        return result;
    }
}

module.exports = new Time();