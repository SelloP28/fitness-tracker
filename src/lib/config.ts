const requiredEnvironment = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
};

const missingEnvironment = Object.entries(requiredEnvironment)
  .filter(([, value]) => !value?.trim())
  .map(([key]) => `VITE_APPWRITE_${key.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase()}`);

if (missingEnvironment.length > 0) {
  throw new Error(
    `Missing required Appwrite environment variable(s): ${missingEnvironment.join(', ')}. ` +
      'Add them to the project root .env file and restart the development server.'
  );
}

export const config = {
  endpoint: requiredEnvironment.endpoint!,
  projectId: requiredEnvironment.projectId!,
  databaseId: requiredEnvironment.databaseId!,
  bucketId: requiredEnvironment.bucketId!,
};
