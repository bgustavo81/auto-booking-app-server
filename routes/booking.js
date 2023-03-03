const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const Booking = require("../models/booking");
const Vehicle = require("../models/vehicle");
const User = require("../models/users");
const stripe = require("stripe")(process.env.StripeSecretKey);


// @route    GET api/booking/billing
// @desc     process stripe payment and create booking
// @access   Private
router.post("/billing", auth, async (req, res, next) => {
    try {
        await stripe.charges.create({
            amount: 500,
            currency: 'usd',
            description: '$5 for 5 bugs',
            source: req.body.token.id
        })
        let stripeId = req.body.token.id;
        let price = req.body.price;
        let vehicleId = req.body.vehicle_id;

        let vehicle = await Vehicle.getVehicleById(vehicleId);
        vehicle = vehicle.rows[0];
        let renterInfo = await User.getUserById(vehicle.user_id); 
        let renteeInfo = await User.getUserById(req.user.id);
        renterInfo = renterInfo.rows[0];
        renteeInfo = renteeInfo.rows[0];
        let renteeEmail = renterInfo.email;
        let renterEmail = renterInfo.email;
        let vehicleTitle = vehicle.title;
        let vehicleLocation = vehicle.location;
        let vehiclePhoto = vehicle.photo;
        let vehicleDescription = vehicle.description;
        let vehiclePerks = vehicle.perks;
        let renterId = renterInfo.user_id;
        let renteeId = renteeInfo.user_id;
        let checkIn = req.body.startDate;
        let checkOut = req.body.endDate;

        let booking = new Booking(null, stripeId, renteeEmail, renterEmail, vehicleId, vehicleTitle, vehicleLocation, vehiclePhoto, vehicleDescription, vehiclePerks, renterId, renteeId, checkIn, checkOut, price);
        await booking.createBooking();
        booking = await Booking.getLatestBookingByUser(renteeId);
        res.status(200).send(booking.rows[0]);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});

//@route GET api/booking/personal-bookings
//@desc Get all booking
//@access Private
router.get("/personal-bookings", auth, async (req, res) => {
    try {
      const renteeId = req.user.id;
      const booking = await Booking.getBookingByUserId(renteeId);
      res.status(200).json(booking.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error in booking.js");
    }
});

//@route GET api/booking/booked-listings
//@desc Get all booking
//@access Private
router.get("/booked-listings", auth, async (req, res) => {
    try {
      const renteeId = req.user.id;
      const booking = await Booking.getBookedListingsByUserId(renteeId);

      res.status(200).json(booking.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error in booking.js");
    }
});

//@route GET api/booking/:booking_id
//@desc Get a single booking, latest
//@access Private
router.get("/:booking_id", auth, async (req, res) => {
try {
    let renteeId = parseInt(req.user.id);
    let booking = await Booking.getLatestBookingByUser(renteeId);

    res.status(200).json(booking.rows[0]);
} catch (err) {
    console.error(err.message);
    res.status(500).send("Server error in booking.js");
}
});

// @route DELETE api/vehicle/:id
// @desc Delete a single vehicle
// @access Private
router.delete("/:vehicle_id", auth, async (req, res) => {
try {

    const vehicle = await Vehicle.getVehicleById(req.params.vehicle_id);
    if (vehicle.rows.length === 0) {
    return res.status(404).json({ msg: "vehicle not found" });
    }
    //Make sure user is deleting his own vehicle
    if (vehicle.rows[0].user_id !== req.user.id) {
    return res
        .status(401)
        .json({ msg: "User not authorized to delete this listing" });
    }

    await Vehicle.deleteVehicleById(req.params.vehicle_id);

    res.status(200).json({ msg: "Listing was removed" });
} catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
    return res.status(404).json({ msg: "Vehicle not found" });
    }
    res.status(500).send("Server error in vehicle.js");
}
});

module.exports = router;