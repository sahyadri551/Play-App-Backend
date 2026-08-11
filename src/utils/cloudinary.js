import { v2 } from 'cloudinary';
import fs from 'node:fs';
import chalk from 'chalk';

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        const result = await v2.uploader.upload(filePath, {
            resource_type: 'auto',
        });
        console.log(chalk.green(`->>> File uploaded to Cloudinary: ${result.secure_url}`));
        return result;
    } catch (error) {
        console.error(chalk.red('Error uploading to Cloudinary:', error));
        fs.unlinkSync(filePath);
        return null;
    }
};

export default uploadOnCloudinary;