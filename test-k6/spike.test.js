import http from 'k6/http';
const ROOT = 'http://localhost:3000';

export const options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  duration: '100s',
  vus: 100, // concurrent Virtual Users
};

export default function () {
  http.get(`${ROOT}/users/user/U1`);
}
