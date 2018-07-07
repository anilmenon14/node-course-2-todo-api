const bcrypt = require('bcryptjs');

hash1 = "$2a$10$lrRHlJqYjfL1bX7okXmNMOegbQrYYhZm5R9yTemNReCu23mu5dvki";

hash2 = "$2a$10$qTen/VyDWUjgeA3OBw5Gr.rg6/Ngbv547BMjo6YiGTeRwzrWoHP1i";


bcrypt.compare(hash1,hash2,(err,stat) => {
  if (stat){
    console.log('Auth passed');
  }
  else {
    console.log('Auth failed');
  }
});
