import http from 'k6/http';
import { check } from 'k6';

const maxTarget = 2000; // max number of concurrent virtual users
const duration = '1s';
const endpoint = 'http://localhost:3000/users/user/U1';
const stages = [];
for (let target = 100; target <= maxTarget; target += 100) {
  stages.push({ duration, target });
}

export const options = {
  stages,
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
  },
  summaryTrendStats: ['avg', 'p(95)', 'p(99)', 'p(99.9)', 'p(99.99)', 'max'],
  summaryTimeUnit: 'ms',
  summaryWindow: '10s',
  http: {
    debug: 'full', // Enable detailed HTTP request logging
  },
};

export default function () {
  const res = http.get(endpoint);
  check(res, { 'status was 200': (r) => r.status == 200 });
}
