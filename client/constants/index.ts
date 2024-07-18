export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const PASSWORD_REGEX = /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*].{6,}$/;
export const UUID_REGEX =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
export const PAGE_LIMIT = 10;

export const NAME_MAX_LENGTH = 30;

export const MAX_AVATAR_FILE_SIZE = 1024 * 1024 * 2; // 2MB
