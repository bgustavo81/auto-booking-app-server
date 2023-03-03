const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const User = require("../models/users");

// @route    GET api/auth
// @desc     Get user by id
// @access   Private needs authetication cookie
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.getUserById(userId);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route POST api/auth
//@desc Authenticate (login) user, retrieves token as well
//@access Public
router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with six or more characters"
    ).isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.getUserByEmail(email);
      //Does user exist?
      if (user.rows.length === 0) {
        return res.status(400).json({ errors: [{ message: "Invalid credentials" }] });
      }
      //Check plain text against encrypted password
      const isMatch = await bcrypt.compare(password, user.rows[0].password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ message: "Invalid credentials" }] });
      }

      //Create payload
      const payload = {
        user: {
          id: user.rows[0].user_id
        }
      };
      //Expiration date extreme for testing purposes
      jwt.sign(
        payload,
        process.env.JwtSecret,
        {
          expiresIn: 36000000
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//@route POST api/users
//@desc Create user via registation
//@access Public
router.post(
    "/register",
    [
      check("name", "Name is required")
        .not()
        .isEmpty(),
      check("email", "Please enter a valid email").isEmail(),
      check(
        "password",
        "Please enter a password with six or more characters"
      ).isLength({
        min: 6
      })
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { name, email, password } = req.body;
  
      // generate id
      // const id = Math.floor(Math.random() * 100000000);
  
      try {
        let user = await User.getUserByEmail(email);
        //Does user exist?
        if (user.rows.length >= 1) {
          return res.status(400).send({ errors: [{ message: "User already exists" }] });
        }
        user = new User(
          null,
          email,
          password,
          name
        );

  
        //salt password, default 10
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.createUser();

        user = await User.getUserByEmail(email);
        
        user = user.rows[0];
          
        //Create payload
        const payload = {
          user: {
            id: user.user_id
          }
        };
        //Expiration date extreme for testing purposes
        jwt.sign(
          payload,
          process.env.JwtSecret,
          {
            expiresIn: 360000000
          },
          (err, token) => {
            if (err) throw err;
            res.json({
              token
            });
          }
        );
        //Check if user exits
        //Encrypt password
        //Return json webtoken
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
      }
    }
);
  

module.exports = router;
