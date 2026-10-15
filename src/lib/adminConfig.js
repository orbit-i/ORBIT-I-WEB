// Secret Administrative Route Configuration
// This obscure path ensures the admin portal cannot be brute-forced or guessed by public crawlers.
export const ADMIN_SECRET_PATH = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || '/control-vault-2026';
