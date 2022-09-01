const jwt = require("jsonwebtoken");


const verifyToken = (request, response, next) => {
    const authHeader = request.headers.token;
    if (authHeader) {
        //when we use Bearer for auth in postman
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_KEY, (error, user) => {
            if (error) 
                response.status(403).json("Token is not valid");

            request.user = user;
            next();
        })
    } else{
        return response.status(401).json("You are not authenticated");
    }
};


const verifyTokenAndAuthorization = (request, response, next) => {
    verifyToken(request, response, () => {
        if (request.user.id === request.params.id || request.user.isAdmin) {
            next();
        } else {
            response.status(403).json("You are not allowed to do that");
        }
    });
};

//since only admin can edit the product etc., create another auth function
const verifyTokenAndAdmin = (request, response, next) => {
    verifyToken(request, response, () => {
        if (request.user.isAdmin) {
            next();
        } else {
            response.status(403).json("You are not allowed to do that");
        }
    });
};


module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin};

