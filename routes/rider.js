var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
/* GET home page. */
router.post('/signup', function(req, res, next) {
    const {
        firstName,
        lastName,
    } = req.body;

    const rider = {
        id: uuidv4(),
        firstName,
        lastName,
    };
    db.riders.push(rider);
    res.status(200).json({
        success: true,
        data: rider,
    });
});

router.post('/trip/start', (req, res, next) => {
    const {
        x, y, id, radius
    } = req.body;
    const potentialDrivers = db.drivers
                    .filter(driver => driver.available === true)
                    .filter(driver => {
                        const distance = Math.sqrt(
                            Math.pow(driver.x - x, 2) + Math.pow(driver.y - y, 2)
                        );
                        return distance <= radius;
                    });
    console.log("potentialDrivers", potentialDrivers);
    if(potentialDrivers.length === 0) {
        res.status(404).json({
            success: false,
            data: 'No drivers available',
        });
        return;
    }
    const driver = potentialDrivers[0];
    console.log("Selected Driver", driver);
    const trip = {
            tripId: uuidv4(),
            riderId: id,
            driverId: driver.id,
            startTime: new Date(),
            endTime: null,
    };
    db.trips.push(trip);
    driver.available = false;
    res.status(200).json({
        success: true,
        data: {
            trip,
            driver,
        }
    });
    notifyDriver(driver.id, trip.id);
});

const notifyDriver = (driverId, tripId) => {
    console.log(`Notifying driver ${driverId} about trip with id ${tripId}`);
};

router.get('/all', (req, res, next) => {
    res.status(200).json({
        success: true,
        data: db.riders,
    });
})

module.exports = router;
