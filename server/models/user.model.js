import mongoose from 'mongoose';
import crypto from 'crypto'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },

    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },

    created: {
        type: Date,
        default: Date.now
    }, 
    updated: Date, 
    
    hashed_password: {
        type: String,
        required: "Password is required"
    },
    salt: String
});

UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
        console.log(this.hashed_password);
    })
    .get(function() {
        return this._password;
    });

UserSchema.methods = {
    authenticate: function(plainText){
        //console.log('HELLOOOOOOOO', this)
        console.log(this.hashed_password, this.encryptPassword(plainText));
        return this.encryptPassword(plainText) == this.hashed_password;
    },
    encryptPassword: function(password){
        //console.log('HELLOOOO ENCRYPTY')
        if (!password) return ' ';
        try {
            return crypto
                .createHmac('sha256', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            //console.log(err)
            return ' ';
        }
    },
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
};

UserSchema.path('hashed_password').validate(function (v) {
    if (this._password && this._password.length < 6) {
        this.invalidate('password', 'Password must be at least 6 characters');
    } 
    if (this.isNew && !this._password){
        
        this.invalidate('password', 'Password is require');
    }
});

export default mongoose.model('User', UserSchema)


