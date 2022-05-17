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
}

module.exports = new Time();