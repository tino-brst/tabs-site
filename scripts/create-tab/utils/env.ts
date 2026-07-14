import * as v from 'valibot'

const EnvSchema = v.object({
  SPOTIFY_CLIENT_ID: v.pipe(v.string(), v.nonEmpty()),
  SPOTIFY_CLIENT_SECRET: v.pipe(v.string(), v.nonEmpty()),
  GENIUS_ACCESS_TOKEN: v.pipe(v.string(), v.nonEmpty()),
})

type Env = v.InferOutput<typeof EnvSchema>

function loadEnv(): Env {
  const result = v.safeParse(EnvSchema, process.env)

  if (!result.success) {
    throw new Error(
      `Invalid environment variables\n${v.summarize(result.issues)}`,
    )
  }

  return result.output
}

export { loadEnv }
