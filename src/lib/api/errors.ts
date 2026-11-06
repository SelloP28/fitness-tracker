export function friendlyError(error: unknown, action: string): Error {
  const message = error instanceof Error ? error.message : '';
  const normalizedMessage = message.toLowerCase();

  if (
    error instanceof TypeError ||
    normalizedMessage.includes('failed to fetch') ||
    normalizedMessage.includes('network')
  ) {
    return new Error(`Unable to ${action} because of a network connection problem. Check your connection and try again.`);
  }

  const code = typeof error === 'object' && error !== null && 'code' in error
    ? Number((error as { code?: unknown }).code)
    : undefined;

  if (code === 401 || normalizedMessage.includes('unauthorized')) {
    return new Error(`Your session may have expired. Sign in again to ${action}.`);
  }

  return new Error(`Unable to ${action}. Check that your Appwrite tables and permissions are configured, then try again.`);
}

export function authErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message.toLowerCase() : '';
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? Number((error as { code?: unknown }).code)
    : undefined;

  if (code === 401 || message.includes('invalid_credentials') || message.includes('invalid credentials')) {
    return 'The email or password is incorrect. Check your details and try again.';
  }
  if (
    error instanceof TypeError ||
    message.includes('failed to fetch') ||
    message.includes('network')
  ) {
    return 'Unable to reach the sign-in service. Check your internet connection and try again.';
  }
  if (code === 429) {
    return 'Too many sign-in attempts. Wait a moment and try again.';
  }
  return 'Sign-in failed. Check your email and password, then try again.';
}
