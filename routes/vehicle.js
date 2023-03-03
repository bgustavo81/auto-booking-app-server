const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const Vehicle = require("../models/vehicle");
const Favorite = require("../models/favorite");
const { getFavoriteByUserAndVehicle } = require("../models/favorite");

// @route POST api/vehicle
// @desc Create a vehicle
// @access Private
router.post(
  "/",
  [
    auth,
    [
      check("title", "Text is required!")
        .not()
        .isEmpty(),
      check("location", "Location is required!")
        .not()
        .isEmpty(),
      check("description", "Description is required!")
        .not()
        .isEmpty(),
      check("perks", "Perks is required!")
        .not()
        .isEmpty(),
      check("minBooking", "Min booking is required!")
        .not()
        .isEmpty(),
      check("maxBooking", "Max booking is required!")
        .not()
        .isEmpty(),
      check("price", "Price is required!")
        .isInt().withMessage("The price must be a whole number!"),
      check("price", "Price is required!")
        .not().isString(),
    ]
  ],
  async (req, res) => {
const {
  title,
  location,
  photo,
  description,
  perks,
  minBooking,
  maxBooking,
  price
} = req.body;


const userId = req.user.id;

    try {
    //Destructuring



    let vehicle = new Vehicle(null, title, location, photo, description, perks, minBooking, maxBooking, price, userId);
    await vehicle.createVehicle();
    vehicle = await Vehicle.getLatestVehicleByUser(userId);
    
    res.status(201).json(vehicle.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error in posts.js");
    }
  }
);

// @route PATCH api/vehicle/:vehicle_id
// @desc Update a vehicle
// @access Private
router.patch(
  "/:vehicle_id",
  [
    auth,
    [
      check("title", "Text is required!")
        .not()
        .isEmpty(),
      check("location", "Location is required!")
        .not()
        .isEmpty(),
      check("description", "Description is required!")
        .not()
        .isEmpty(),
      check("perks", "Perks is required!")
        .not()
        .isEmpty(),
      check("minBooking", "Min booking is required!")
        .not()
        .isEmpty(),
      check("maxBooking", "Max booking is required!")
        .not()
        .isEmpty(),
      check("price", "Price is required!")
        .isInt().withMessage("The price must be a whole number!"),
      check("price", "Price is required!")
        .not().isString(),
    ]
  ],
  async (req, res) => {
    const {
      title,
      location,
      photo,
      description,
      perks,
      minBooking,
      maxBooking,
      price,
      user_id,
      vehicle_id
    } = req.body;

    const userId = req.user.id;


    // if (userId !== user_id) {
    //   res.status(401).send("You are not authorized to make this update");
    // }

    try {
    //Destructuring
    await Vehicle.updateVehicle(title, location, photo, description, perks, minBooking, maxBooking, price, vehicle_id);

    let vehicle = await Vehicle.getLatestVehicleByUser(userId);
    res.status(201).json(vehicle.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error in posts.js");
    }
  }
);

//@route GET api/vehicle
//@desc Get all vehicles
//@access Private
router.get("/", auth, async (req, res) => {
  try {
    const vehicles = await Vehicle.getVehicles();

    res.status(200).json(vehicles.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error in vehicles.js");
  }
});


//@route GET api/vehicle/personal-listings
//@desc Get all vehicles
//@access Private
router.get("/personal-listings", auth, async (req, res) => {
  try {
    const user_id = req.user.id;
    const vehicles = await Vehicle.getVehiclesByUserId(user_id);

    res.status(200).json(vehicles.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error in vehicles.js");
  }
});

//@route GET api/vehicle/:vehicle_id
//@desc Get a single vehicle
//@access Private
router.get("/:vehicle_id", auth, async (req, res) => {
  try {    
    const vehicle = await Vehicle.getVehicleById(req.params.vehicle_id);
    res.status(200).json(vehicle.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error in vehicle.js");
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

//@route GET api/vehicle/my-favorites
//@desc Get all vehicles
//@access Private
router.get("/favorites/my-favorites", auth, async (req, res) => {
  try {
    let user_id = req.user.id;
    let favorite = await Favorite.getFavoriteByUser(user_id);
    let vehicle_ids = [];
    favorite = favorite.rows.filter(fav => fav.favorite === 1);
    let vehicles = await Vehicle.getVehicles();

    for (let i = 0; i < favorite.length; i++) {
        vehicle_ids.push(favorite[i].vehicle_id);
    }
    let vehicle_list = []; 
    for (let i = 0; i < vehicle_ids.length; i++) {
      vehicle = vehicles.rows.filter( vehicle => vehicle.vehicle_id === vehicle_ids[i])
      vehicle_list.push(vehicle[0]);
    }

    if (vehicle_list[0] === undefined) {
      vehicle_list = []
    }
    res.status(200).json(vehicle_list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error in vehicles.js");
  }
});

// @route PUT api/vehicle/like/:id
// @desc PUT a like on a single vehicle
// @access Private
router.patch("/favorite/:vehicle_id", auth, async (req, res) => {
  try {
    let vehicle_id = parseInt(req.params.vehicle_id);
    let user_id = req.user.id;
    let favorite = await Favorite.getFavoriteByUserAndVehicle(user_id, vehicle_id);

    //Check if vehicle was already favorited
    if (favorite.rows.length === 0) {
    // then create a favorite, default 0 in DB for favorite
      let favorite = new Favorite(null, 1, user_id, vehicle_id);
      await favorite.createFavorite();
    } else if (favorite.rows[0].favorite === 0) {
      favorite = await Favorite.updateFavorite(1, user_id, vehicle_id);
    } else if (favorite.rows[0].favorite === 1) {
      favorite = await Favorite.updateFavorite(0, user_id, vehicle_id);
    }else {
      return res.status(400).json({ msg: "Could not update listing" });
    }

    favorite = await getFavoriteByUserAndVehicle(user_id, vehicle_id);
    res.status(200).json(favorite.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error in favorite.js");
  }
});


//@route GET api/vehicle/favorite/:vehicle_id
//@desc Get all vehicles
//@access Private
router.get("/favorite/:vehicle_id", auth, async (req, res) => {
  try {
    let vehicle_id = parseInt(req.params.vehicle_id);
    let user_id = req.user.id;
    const favorite = await Favorite.getFavoriteByUserAndVehicle(user_id, vehicle_id);

    res.status(200).json(favorite.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error in vehicles.js");
  }
});

module.exports = router;
