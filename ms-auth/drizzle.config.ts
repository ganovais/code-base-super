import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/infra/database/schemas/*',
	out: './src/infra/database/drizzle',
	dbCredentials: {
		url:
			process.env.DATABASE_URL ||
			'postgresql://auth_user:auth_password@localhost:5432/auth_db'
	},
	verbose: true,
	strict: true
})
