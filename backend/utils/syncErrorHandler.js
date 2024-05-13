module.exports = (func) => {
    return (req, res, next) => {
        try{
            func(req, res, next);
        }
        catch(error) {
            next(error);
        }
    }
}