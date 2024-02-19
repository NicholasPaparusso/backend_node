const express = require('express');
const { createJSONToken, isValidPassword } = require('../util/auth');
const { isValidEmail, isValidText } = require('../util/validation');
const {getUserEmail,getUserId, userExist, addUser,modifyUser, getAllUser}  = require('../database/user_db')
const router = express.Router();
const multer = require('multer');
const fs = require('node:fs');
const { error } = require('node:console');

const storage = multer.diskStorage({
  destination: function(req, file, callback){
    const dirName = '../../public/immagini/users'+req.body.nominativo.replace(/\s+/g, '');;
    try {
      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, {recursive: true});
      }else{
        fs.rmSync(dirName, { recursive: true, force: true });
        fs.mkdirSync(dirName, {recursive: true});
      }
    } catch (err) {
      console.error(err);
    }
    callback(null,dirName);
  },

  filename: function (req,file,callback){
    const filename = file.originalname;
    callback(null,filename)
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1048576
  }
});

router.post('/signup',upload.single('image_file'), async (req, res, next) => {

  const data = req.body;
  const image = req.file;
  const email = data.email;
  const password = data.password;

  if(image){
    data.image_file = image.originalname;
  }else{
    data.image_file = '';
  }


  let errors = {};

  if (!isValidEmail(email)) {
      errors.email = 'Invalid email';
  } else {
    try {
      const isUserSignedUp = await userExist(email);
      if (isUserSignedUp) {
        errors.email = 'Email exists already.';
      }
    } catch (error) {}
  }

  if (!isValidText(password, 8)) {
     errors.password = 'Invalid password. Must be at least 6 characters long.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: 'User signup failed due to validation errors.',
      errors,
    });
  }

  try {
    const createdUser = await addUser(data);
    const token = createJSONToken(email);

    if(createdUser){
      let loginData = {email ,password};
      res
      .status(201)
      .json({loginData, token });
    }
    // if(createdUser){
    //   try {
    //     user = await getUser(email);
    //   } catch (error) {
    //     return res.status(401).json({ message: 'Authentication failed.' });
    //   }
    // }

  } catch (error) {
    next(error);
  }



});

router.get('/allUsers', async (req, res)=> {
  try{
    const users = await getAllUser();
    return res.json(users);
  }catch(error){
    return error
  }
});

router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let user;
  try {
    user = await getUserEmail(email);
    if(user.length === 0){
      throw error
    }
  } catch (error) {
    return res.status(422).json({
      message: 'Credenziali non valide.',
      errors: { credentials: 'email' , message: 'Email non valida.' },
    });
  };



  const pwIsValid = await isValidPassword(password, user[0].password);

  // if(!emailIsValid) {
  //   return res.status(422).json({
  //     message: 'Credenziali non valide.',
  //     errors: { credentials: 'email' , message: 'Email non valida.' },
  //   });
  // };

  if (!pwIsValid) {
    return res.status(422).json({
      message: 'Credenziali non valide.',
      errors: { credentials: 'psw' , message: 'Password non valida.' },
    });
  };


  const token = createJSONToken(email);
  res.json({ token,user });
});

router.post('/changeAccountData',upload.single('image_file'), async (req, res, next) => {

  const data = req.body;
  const image = req.file;
  const email = data.email;
  const oldEmail = data.oldEmail
  const password = data.password;
  const isImageDelete = data.isImageDelete
  const nominativo = data.nominativo



  if(image){
    data.image_file = image.originalname;
  }else if(isImageDelete){
    data.image_file = 'deleted'
  }else{
    data.image_file = '';
  }


  let errors = {};

  if (!isValidEmail(email)) {
      errors.email = 'Invalid email';
  } else {
    try {
      const isUserSignedUp = await userExist(oldEmail);
      if (!isUserSignedUp) {
        errors.email = 'Email does not exists.';
      }
    } catch (error) {}
  }

  if (!isValidText(password, 8)) {
     errors.password = 'Invalid password. Must be at least 6 characters long.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: 'User signup failed due to validation errors.',
      errors,
    });
  }

  let user = await getUserEmail(oldEmail)
  user = user[0];

  
  try {
    const modifiedUser = await modifyUser(data,user.id);
    const token = createJSONToken(email);
    if(modifiedUser){
      if(nominativo !=  user.nominativo){
        const oldDirName =  './immagini/users/'+user.nominativo.replace(/\s+/g, '');
        const dirName = './immagini/users/'+nominativo.replace(/\s+/g, '');;
        fs.renameSync(oldDirName,dirName);
      }

      let loginData = {email ,password};
      res
      .status(201)
      .json({loginData, token });
    }

  } catch (error) {
    next(error);
  }



});

module.exports = router;

// router.post('/signup', async (req, res, next) => {
//   const data = req.body;
//   let errors = {};

//   if (!isValidEmail(data.email)) {
//     errors.email = 'Invalid email.';
//   } else {
//     try {
//       const existingUser = await get(data.email);
//       if (existingUser) {
//         errors.email = 'Email exists already.';
//       }
//     } catch (error) {}
//   }

//   if (!isValidText(data.password, 6)) {
//     errors.password = 'Invalid password. Must be at least 6 characters long.';
//   }

//   if (Object.keys(errors).length > 0) {
//     return res.status(422).json({
//       message: 'User signup failed due to validation errors.',
//       errors,
//     });
//   }

//   try {
//     const createdUser = await add(data);
//     const authToken = createJSONToken(createdUser.email);
//     res
//       .status(201)
//       .json({ message: 'User created.', user: createdUser, token: authToken });
//   } catch (error) {
//     next(error);
//   }
// });
