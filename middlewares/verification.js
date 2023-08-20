// creating a verification system for api calls
// this is a middleware that will be used in the routes
const Authentication = (handler) => (req, res) => {
    const AuthCode = req.headers.authorization;
    const SecretKey = AuthCode.replace(/^Bearer /, '');
    const expectedSecretKey = process.env.NEXT_PUBLIC_EXPECTED_SECRET_KEY; // Set this to your secret key
    if (!SecretKey || SecretKey !== expectedSecretKey) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const { referer } = req.headers;
    const refererHost = new URL(referer).hostname;
    console.log(` ${refererHost} is requesting access to the API`)

    return handler(req, res);
};
export default Authentication;