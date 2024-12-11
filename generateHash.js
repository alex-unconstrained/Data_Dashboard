   // generateHash.js
   const bcrypt = require('bcryptjs');

   const password = 'password123';
   const saltRounds = 10;

   bcrypt.hash(password, saltRounds, (err, hash) => {
     if (err) {
       console.error('Error generating hash:', err);
     } else {
       console.log('Hashed Password:', hash);
     }
   });