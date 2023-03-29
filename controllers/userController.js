const {
    generatePasswordHash,
    validatePassword,
    generateUserToken,
    verifyToken,
	} = require("../auth");

const User = require('../models/User');

/* GET users listing. */
async function getAllUsers (req, res) {
    try {
        const allUsers = await User.find({});
        res.json({users: allUsers });
      }catch(e){
        console.log(e);
      }
};

async function registration (req, res) {
  	try {
    	const email = req.body.email;
    	let password = req.body.password;
		let type = 'user'
    	const saltRounds = 5; // In a real application, this number would be somewhere between 5 and 10
    	password = await generatePasswordHash(password, saltRounds);
		if(email.includes('admin.com')){
			type = 'admin';
		}
		const newUser = new User ({
            email,
            password,
			type
        })
        await newUser.save();
    	res.json({ success: true });
  	} catch (error) {
    	console.error(error);
    	res.json({ success: false, message: error.toString() });
  	}
};

async function login (req, res) {
  	try {
    	const email = req.body.email;
    	const password = req.body.password;
    	const user = await User.findOne({email:email});
    	if (!user) {
      		res.json({ success: false, message: "Could not find user." }).status(204);
      	return;
    	}
    	const isPWValid = await validatePassword(password, user.password);
    	if (!isPWValid) {
      	res.json({ 
			success: false, 
			message: "Password was incorrect."}).status(204);
      	return;
    	}
    	const userType = email.includes("admin.com") ? "admin" : "user";
    	const data = {
      		ate: new Date(),
      		userId: user.id, 
      		scope: userType,
			email: email
    	};
    	const token = generateUserToken(data);
    	res.json({ success: true, token, email });
    	return;
  	} catch (error) {
    	console.error(error);
    	res.json({ success: false, message: error.toString() });
  	}
};

async function message (req, res) {
	try {
	  	const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
	  	const token = req.header(tokenHeaderKey);
		const verifiedTokenPayload = verifyToken(token)
	  	if (!verifiedTokenPayload) {
			return res.json({
		  		success: false,
		  		message: false
			});
	  	}
	  	const userData = verifiedTokenPayload.userData;
	  	if (userData && userData.scope === "user") {
			return res.json({
				success: true,
		  		message: true
			});
	  	}
		if (userData && userData.scope === "admin") {
			return res.json({
		  		success: true,
		  		message: true
			});
	  	}
	  	throw Error("Access Denied");
	} catch (error) {
	  	// Access Denied
	  	return res.status(401).json({ success: false, message: error });
	}
};
  

module.exports = {
    registration,
    login,
    getAllUsers,
	message
};