const router = require('express').Router();
const multer = require('multer');
const File = require('../models/file');
const { v4: uuid4 } = require('uuid');
const path = require('path');

//for Storing  the  received file
let storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },

  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }

});


let upload = multer({
  storage: storage,
  limit: { fileSize: 1000000 * 100 },

}).single('myfiles');




router.post('/', (req, res) => {

  //store file
  upload(req, res, async (err) => {
    //validating the request

    if (!req.file) {
      return res.json({ error: 'All fields are required' });
    }

    if (err) {
      return res.status(500).send({ error: err.message });
    }

    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size
    });

    const response = await file.save();
    return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
  })

})

router.post('/send', async (req, res) => {

    const {uuid, emailFrom, emailTo} = req.body;

  if(!uuid || !emailFrom || !emailTo){
    return res.status(422).send({ error: 'All field are required.'});
  }

    const file = await File.findOne({uuid : uuid});

    if(file.sender){
      return res.status(422).send({ error: 'Email is already sent.'});
    }

    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();


    const sendMail = require('../services/emailService');
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: 'ishare file share',
      text: `${emailFrom} shared a file with you`,
      html:  require('../services/emailTemplate')({
         emailFrom,

        downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,

        size: parseInt(file.size/1000) + ' KB',

        expires: '24 hours'
      })
    });

    return res.send({success :true})

})


// router.post('/send', async (req, res) => {
// console.log(req.body);

//   const { uuid, emailTo, emailFrom} = req.body;
  
//   if (!uuid || !emailTo || !emailFrom) {
//     return res.status(422).send({ error: 'All fields are required except expiry.' });
//   }
//   // Get data from db 
  
//   try {
//     const file = await File.findOne({ uuid: uuid });
//     if (file.sender) {
//       return res.status(422).send({ error: 'Email already sent once.' });
//     }
//     file.sender = emailFrom;
//     file.receiver = emailTo;
//     const response = await file.save();
//     // send mail

//     const sendMail = require('../services/emailService');

//     sendMail({
//       from: emailFrom,
//       to: emailTo,
//       subject: 'inShare file sharing',
//       text: `${emailFrom} shared a file with you.`,
//       html: require('../services/emailTemplate')({
//         emailFrom,
//         downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email`,
//         size: parseInt(file.size / 1000) + ' KB',
//         expires: '24 hours'
//       })
//     })
//     .then(() => {
    
//       return res.json({ success: true });
    
//     }).catch(err => {
      
//       console.log(err);
      
//       return res.status(500).json({ error: 'Error in email sending.' });
//     });
  
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send({ error: 'Something went wrong.' });
  
//   }

//});

module.exports = router;