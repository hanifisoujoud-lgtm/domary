const bcrypt = require('bcrypt');

async function run() {
  const password = '123'; // admin password
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
}

run();
