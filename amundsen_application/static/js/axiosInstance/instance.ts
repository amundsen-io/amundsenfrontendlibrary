import axios from 'axios';

import { publicPath } from 'config/config';

export default axios.create({
  baseURL: publicPath,
});
