import { defineConfig } from 'drizzle-kit'

const localURL = 'postgresql://tasks_user:tasks_password@localhost:5433/tasks_db'
const url = process.env.DATABASE_URL || localURL

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/infra/database/schemas/*',
	out: './src/infra/database/drizzle',
	dbCredentials: {
		url
	},
	verbose: true,
	strict: true
})
