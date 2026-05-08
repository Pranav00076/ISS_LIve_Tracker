const axios = require('axios');
axios.get('http://api.open-notify.org/astros.json')
  .then(res => console.log(res.data))
  .catch(err => console.error(err.message, err.response?.data, err.response?.status));
