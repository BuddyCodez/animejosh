const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: {
        type: 'string',
    },
    email: {
        type: 'string',
    },
    image: {
        type: 'string',
    }
});
// Cannot overwrite `user` model once compiled.
// So, we need to check if the model exists.

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

module.exports = userModel;