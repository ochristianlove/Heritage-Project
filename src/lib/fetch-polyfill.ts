const fetch = window.fetch.bind(window);
const Headers = window.Headers;
const Request = window.Request;
const Response = window.Response;
const FormData = window.FormData;

export default fetch;
export { Headers, Request, Response, FormData };

// For formdata-polyfill alias
export const blob = window.Blob;
