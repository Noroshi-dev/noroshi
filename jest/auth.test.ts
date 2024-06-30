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
		let token;
		try {
			const response = await axios.post(`${URL}/auth`, {
				username,
				password,
			});
			token = response.data.token;
			expect(response.status).toBe(200);
		} catch (e) {
			console.error((e as AxiosError).response?.data);
		}
		// Logout
		try {
			const res = await axios.delete(`${URL}/auth`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			expect(res.status).toBe(200);
			expect(res.data).toEqual({});
		} catch (e) {
			console.error((e as AxiosError).response?.data);
		}
		// Confirm token is invalid
		try {
			const res = await axios.get(`${URL}/users/me`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			expect(false).toBe(true);
		} catch (e) {
			expect((e as AxiosError).response?.status).toBe(401);
		}
		// Login again
		try {
			const response = await axios.post(`${URL}/auth`, {
				username,
				password,
			});
			token = response.data.token;
			expect(response.status).toBe(200);
		} catch (e) {
			console.error((e as AxiosError).response?.data);
		}
		try {
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
