// Jamshed Ali Added Start - Bug ID 2555
// Description: Updated API helper to support dynamic baseURL instead of fixed BASE_URL.
// This allows switching between different servers (local, staging, live) dynamically.


// import axios from "axios";
// import { BASE_URL } from "./apiurls";

// const api = axios.create({
//     baseURL: BASE_URL,
//     timeout: 10000,
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//     },
// });

// /**
//  * Generic API caller using Axios
//  * @param {string} url - endpoint path
//  * @param {string} method - HTTP method (GET, POST, etc.)
//  * @param {object} data - request body
//  * @param {object} customHeaders - optional custom headers
//  * @returns {Promise<object>} - API response
//  */
// const makeApiCall = async (url, method = 'POST', data = {}, customHeaders = {}) => {
//     try {
//         const response = await api({
//             url,
//             method,
//             data,
//             headers: {
//                 ...api.defaults.headers,
//                 ...customHeaders
//             }
//         });
//         return response.data;
//     } catch (error) {
//         console.error("API call error:", error?.response?.data || error.message);
//         throw error;
//     }
// };

// export default makeApiCall;



import axios from "axios";

/**
 * Generic API caller using Axios
 * @param {string} baseURL - base API URL (from context)
 * @param {string} url - endpoint path
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {object} data - request body
 * @param {object} customHeaders - optional custom headers
 * @returns {Promise<object>} - API response
 */
const makeApiCall = async (baseURL, url, method = 'POST', data = {}, customHeaders = {}) => {
    const api = axios.create({
        baseURL,
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...customHeaders,
        },
    });

    try {
        const response = await api({
            url,
            method,
            data,
        });
        return response.data;
    } catch (error) {
        console.error("API call error:", error?.response?.data || error.message);
        throw error;
    }
};

export default makeApiCall;
// Jamshed Ali Added End - Bug ID 2555

