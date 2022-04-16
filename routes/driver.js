var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

router.post('/signup', (req, res, next) => {
    const {
        firstName,
        lastName,
        x,
        y
    } = req.body;

    const driver = {
        id: uuidv4(),
        firstName,
        lastName,
        available: true,
        x,
        y,
    };
    db.drivers.push(driver);
    res.status(200).json({
        success: true,
        data: driver,
    });
});

router.get('/all', (req, res, next) => {
    res.status(200).json({
        success: true,
        data: db.drivers,
    });
});

router.post('/trip/end', (req, res, next) => {
    const {
        tripId,
        x,
        y,
    } = req.body;
    const trip = db.trips.find(trip => trip.tripId === tripId);
    console.log(trip);
    if(!trip) {
        res.status(404).json({
            success: false,
            data: 'Trip not found',
        });
        return;
    }
    const { driverId } = trip;
    const driver = db.drivers.find(driver => driver.id === driverId);
    console.log("Found Driver");
    trip.endTime = new Date();
    driver.available = true;
    driver.x = x;
    driver.y = y;
    res.status(200).json({
        success: true,
        data: 'Trip Ended',
    });
});

router.post('/availibility/switch', (req, res, next) => {
    const {
        id,
        available,
        x,
        y,
    } = req.body;
    const driver = db.drivers.find(driver => driver.id === id);
    if(!driver) {
        res.status(404).json({
            success: false,
            data: 'Driver not found',
        });
        return;
    }
    driver.available = available;
    if(available === true) {
        driver.x = x;
        driver.y = y;
    }
    res.status(200).json({
        success: true,
        data: driver,
    });
})

module.exports = router;
