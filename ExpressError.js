class ExpressError extends Error {
    constructor( status,message) { // define error in expressError.js
        super(); // call  super constructor
        this.status = status;
        this.message = message;
    }
}

module.exports = ExpressError;