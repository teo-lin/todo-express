import http from 'k6/http'

export const options = {
	insecureSkipTLSVerify: true,
	noConnectionReuse: false,
	duration: '100s',
	vus: 100, // concurrent Virtual Users
}

export default function () {
	http.post('http://localhost:3333/users/register', {
		userName: 'userX',
		passWord: 'passX',
		fullName: 'Gillian Beck',
	})
	http.get('http://localhost:3333/users/user/U1')
	http.put('http://localhost:3333/users/user/U2', {
		fullName: 'James Dean',
		isAdmin: false,
	})
	http.get('http://localhost:3333/users/user/U4')
	http.patch('http://localhost:3333/tasks/task/T1/complete')
}
