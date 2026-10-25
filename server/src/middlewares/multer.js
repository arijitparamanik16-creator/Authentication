import multer from "multer";
//  Multer is an Express middleware used to handle multipart/form-data, mainly for file uploads (images, PDFs, videos, etc.).

// Configure Multer to store uploaded files on the local disk.
const storage= multer.diskStorage({
    
    destination:(req,file,cb)=>{
        cb(null,"./public")
        // The callback sets the destination folder where the uploaded file will be stored, initially it is null
    },
    filename:(req,file,cb)=>{
        // passed file details 
        // console.log(file);

        cb(null,file.originalname)
        // Save the uploaded file using its original filename.
        // if user uploads same files may be same name no error occurs, cause=>  it will delete from the public after storing it in cloudinary 
    }
})


// passing the storage inside the multer and export this middleware 
export const upload=multer({storage})

// now this is a specific middleware not like app.use (middleware for all)