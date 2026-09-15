const ImageKit = require("@imagekit/nodejs")



const imagekit = new ImageKit({
    // privateKey: "private_dypZh2Bhz09NkfT4A6dBaatL70Q="

    privateKey: process.env['ImageKit_Private_Key']
});


// Image file ka buffer data ayse bhejna hai
async function uploadFile(buffer) {
    console.log("Buffer data:", buffer); // ye buffer data ko output karega
    const result = await imagekit.files.upload({
        file: buffer.toString("base64"),
        fileName: "image.jpg"
    })

    return result;
}



module.exports = uploadFile;