import axios from 'axios';

export default axios.create(
  {
    baseURL: 'https://api.unsplash.com',
    headers: {
      Authorization: 'Client-ID fv2cTWNJs5qN8K0HG6cuT7nn9M4rTLi4XlehR3noS70'
    }
  }
);