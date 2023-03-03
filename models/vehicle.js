const pool = require('../config/pool');

module.exports = class Vehicle {
    constructor ( vehicleId, title, location, photo, description, perks, minBooking, maxBooking, price, userId) {
        this.vehicleId = vehicleId;
        this.title = title;
        this.location = location;
        this.photo = photo;
        this.description = description;
        this.perks = perks;
        this.minBooking = minBooking;
        this.maxBooking = maxBooking;
        this.userId = userId;
        this.price = price;
    }

    static getVehicleById(vehicleId) {
        return pool.query(
            'SELECT * FROM booking_vehicle WHERE vehicle_id = $1',
            [vehicleId]
        );
    };

    static getVehiclesByUserId(user_id) {
        return pool.query(
            'SELECT * FROM booking_vehicle WHERE user_id = $1',
            [user_id]
        );
    };

    static getLatestVehicleByUser(userId) {
        return pool.query(
            `SELECT * FROM booking_vehicle WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
            [userId]
        );
    };

    static getVehicles() {
        return pool.query(
            'SELECT * FROM booking_vehicle ORDER BY created_at DESC'
        );
    };

    createVehicle() {
        return pool.query(
            `INSERT INTO booking_vehicle(
                title,
                location,
                photo,
                description,
                perks, 
                minbooking,
                maxbooking,
                user_id,
                price
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [this.title, this.location, this.photo, this.description, this.perks, this.minBooking, this.maxBooking, this.userId, this.price]
        );
    };

    static updateVehicle(title, location, photo, description, perks, minBooking, maxBooking, price, vehicleId) {
        return pool.query(
            `UPDATE booking_vehicle SET
                title = $1,
                location = $2,
                photo = $3,
                description = $4,
                perks = $5,
                minbooking = $6,
                maxbooking = $7,
                price = $8
                WHERE vehicle_id = $9`,
                [title, location, photo, description, perks, minBooking, maxBooking, price, vehicleId]
        );
    };

    static deleteVehicleById(vehicleId) {
        return pool.query(
            'DELETE FROM booking_vehicle WHERE vehicle_id = $1',
            [vehicleId]
        );
    };
};