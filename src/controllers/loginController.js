
const LoginController = {
    
    loginHandler : async (req, res, next) => {
        console.log(req.body);
        return res.json("Succeeded!");
    }

}
module.exports = {
    LoginController
}