class ExpressError extends Error {
    constructor(message, statusCode){
        super();
        this.message = message;
    }
}

module.exports = ExpressError;