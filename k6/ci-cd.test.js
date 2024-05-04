import http from 'k6/http'
const ROOT = 'http://localhost:3333'

export const options = {
	insecureSkipTLSVerify: true,
	noConnectionReuse: false,
	duration: '100s',
	vus: 100, // concurrent Virtual Users
}

export default function () {
	http.post(`${ROOT}/users/register`, {
		username: 'userX',
		password: 'passX',
		fullname: 'Gillian Beck',
	})
	http.get(`${ROOT}/users/user/U1`)
	http.put(`${ROOT}/users/user/U2`, {
		fullname: 'James Dean',
		isAdmin: false,
	})
	http.get(`${ROOT}/users/user/U4`)
	http.patch(`${ROOT}/tasks/task/T1/complete`)
}
