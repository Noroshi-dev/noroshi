import {describe, expect, test} from '@jest/globals';
import axios, { AxiosError } from 'axios';

const URL = 'http://localhost:9000';

describe('auth', () => {
	test('Create user', async () => {
		const username = 'test'
		const password = 'test';
		try {
			const res = await axios.post(`${URL}/users`, {
				username,
				password,
			});
			expect(res.status).toBe(201);
		} catch (e) {
			console.error((e as AxiosError).response?.data);
		}
		// Login
		try {
			const response = await axios.post(`${URL}/auth`, {
				username,
				password,
			});
			const { token } = response.data;
			expect(response.status).toBe(200);
			// Delete user
			const res = await axios.delete(`${URL}/users`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			expect(res.status).toBe(200);
			expect(res.data).toEqual({});
		} catch (e) {
			console.error((e as AxiosError).response?.data);
		}
	});

});
