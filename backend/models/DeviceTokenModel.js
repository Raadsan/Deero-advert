import mongoose from 'mongoose';

const deviceTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true,  // hal token marna hal mar
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,  // login la'aanta null yahay - okay!
        },
    },
    { timestamps: true }
);

const DeviceToken = mongoose.model('DeviceToken', deviceTokenSchema);
export default DeviceToken;
