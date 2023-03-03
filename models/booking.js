const pool = require("../config/pool");

module.exports = class Booking {
    constructor(bookingId, stripeId, renteeEmail, renterEmail, vehicleId, vehicleTitle, vehicleLocation, vehiclePhoto, vehicleDescription, vehiclePerks, renterId, renteeId, checkIn, checkOut, price) {
        this.bookingId = bookingId;
        this.stripeId = stripeId;
        this.renteeEmail = renteeEmail;
        this.renterEmail = renterEmail;
        this.vehicleId = vehicleId;
        this.vehicleTitle = vehicleTitle;
        this.vehicleLocation = vehicleLocation;
        this.vehiclePhoto = vehiclePhoto;
        this.vehicleDescription = vehicleDescription;
        this.vehiclePerks = vehiclePerks;
        this.renterId = renterId;
        this.renteeId = renteeId;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.price = price
    }

    static getBookingByBookingId(bookingId) {
        return pool.query(
            'SELECT * FROM booking_booking WHERE booking_id = $1',
            [bookingId]
        );
    };

    static getBookingByUserId(renteeId) {
        return pool.query(
            'SELECT * FROM booking_booking WHERE rentee_id = $1 ORDER BY created_at DESC',
            [renteeId]
        );
    };

    static getBookedListingsByUserId(renteeId) {
        return pool.query(
            'SELECT * FROM booking_booking WHERE renter_id = $1 ORDER BY created_at DESC',
            [renteeId]
        );
    };

    static getLatestBookingByUser(renteeId) {
        return pool.query(
            'SELECT * FROM booking_booking WHERE rentee_id = $1 ORDER BY created_at DESC LIMIT 1',
            [renteeId]
        );
    };

    static  getBookings() {
        return pool.query(
            'SELECT * FROM booking_booking'
        );
    };

    createBooking() {
        return pool.query(
            `INSERT INTO booking_booking(
                stripe_id,
                rentee_email,
                renter_email,
                vehicle_id,
                vehicle_title,
                vehicle_location,
                vehicle_photo,
                vehicle_description,
                vehicle_perks,
                renter_id,
                rentee_id,
                check_in,
                check_out, 
                price
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
            [
                this.stripeId,
                this.renteeEmail,
                this.renterEmail,
                this.vehicleId,
                this.vehicleTitle,
                this.vehicleLocation,
                this.vehiclePhoto,
                this.vehicleDescription,
                this.vehiclePerks,
                this.renterId,
                this.renteeId,
                this.checkIn,
                this.checkOut,
                this.price
            ]
        );
    };

    static deleteBookingByBookingId(bookingId) {
        return pool.query(
            'DELETE FROM booking_booking WHERE booking_id = $1',
            [bookingId]
        );
    };

}