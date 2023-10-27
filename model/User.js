const mongoose = require('mongoose'); 
const ObjectId = mongoose.Schema.ObjectId;
const bcrypt = require('bcrypt');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
        unique:true,
    },
    googleId:{
        type:String,
        default: 'no_Id'
    },
    facebookId:{
        type:String,
        default: 'no_Id'
    },
    notes: {
        type: ObjectId,
        ref: 'Note'
    },
    accessToken: {
        type: String
    },
    refreshToken: {
        type: String
    },
});

userSchema.pre('save', async function(next){ //pre: đăng ký 1 middleware function trước khi document được lưu vào database
    const salt = await bcrypt.genSaltSync(10); //chuỗi salt ngẫu nhiên để mã hóa mật khẩu, 10 lần lặp lại salt
    this.password = await bcrypt.hash(this.password,salt) //hash password bằng salt
})
userSchema.methods.isPasswordMatched= async function(enteredPassword){  //định nghĩa 1 phương thức isPasswordMatched để so sánh enterPassword và password đã lưu, nếu đúng trả về true
    return await bcrypt.compare(enteredPassword,this.password)
}
//Export the model
module.exports = mongoose.model('User', userSchema);