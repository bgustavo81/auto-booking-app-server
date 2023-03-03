const pool = require('../config/pool');

module.exports = class Favorite {
    constructor(favoriteId, favorite, userId, vehicleId) {
        this.favoriteId = favoriteId;
        this.favorite = favorite;
        this.userId = userId;
        this.vehicleId = vehicleId;
    }

    static getFavoriteByUserAndVehicle(userId, vehicleId) {
        return pool.query(
            'SELECT * FROM booking_favorite WHERE user_id = $1 AND vehicle_id = $2',
            [userId, vehicleId]
        );
    };

    static getFavoriteByUser(userId) {
        return pool.query(
            'SELECT * FROM booking_favorite WHERE user_id = $1',
            [userId]
        );
    };

    createFavorite() {
        return pool.query(
            `INSERT INTO booking_favorite (user_id, vehicle_id)
                VALUES ($1, $2)`,
            [this.userId, this.vehicleId]
        );
    };

    static updateFavorite(favorite, userId, vehicleId) {
        return pool.query(
            `UPDATE booking_favorite SET favorite = $1 WHERE user_id = $2 AND vehicle_id = $3`,
            [favorite, userId, vehicleId]
        );
    };
};