import Axios from 'axios';

//const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : process.env.REACT_APP_API_URL;

const baseUrl = 'http://localhost:5000/';

export default Axios.create({
    baseURL: baseUrl
});