const pool = require('../config/pool');

module.exports = class User {
    constructor(id, email, password, name) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
    }

    static getUserById(userId) {
        return pool.query(
            'SELECT * FROM booking_users WHERE user_id = $1',
            [userId]
        )
    };  
    
    static getUsers() {
        return pool.query(
            'SELECT * FROM booking_users'
        )
    }


    static getUserByEmail(email) {
        return pool.query(
            'SELECT * FROM booking_users where email = $1',
            [email]
        )
    }

    static getUsers() {
        return pool.query(
            'SELECT * FROM booking_users ORDER BY id DESC'
        )
    }

    createUser() {
        return pool.query(
            `INSERT INTO booking_users (email, password, name)
                VALUES ($1, $2, $3)`,
            [this.email, this.password, this.name]
        )
    }

    createLoginUser() {
        return pool.query(
            `INSERT INTO booking_users (id, email, password, name)
                VALUES ($1, $2, $3, $4)`,
            [this.id, this.email, this.password, this.name]
        )
    }

    static updateUser(name, email, id) {
        return pool.query(
            `UPDATE booking_users SET name = $1, email = $2 WHERE id = $3`,
            [name, email, id]
        )
    }

    static deleteUser(id) {
        return pool.query(
            'DELETE FROM booking_users WHERE id = $1',
            [id]
        )
    }

    static deleteProfileByAuthor(author) {
        return pool.query(
            `DELETE FROM booking_users WHERE users.id = $1`,
            [author]
        )
    }
}