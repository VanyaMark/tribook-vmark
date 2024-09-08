const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            validate: {
                validator: function(v) {
                  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
                },
                message: props => `${props.value} is not a valid email!`
              }
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            validate: {
                validator: function(value) {
                    // Regular expression to check password criteria
                    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value);
                },
                message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character!'
            }
          },
        isAdmin: true,
    }
)

const User = model('User', userSchema);

module.exports = User;