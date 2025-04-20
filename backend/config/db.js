import mongoose from "mongoose";

const configDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB Connected");
    } catch (error) {
        console.error(`Error:${error.message}`)
    }
}

export default configDB