export const GRADES = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export type Grade = (typeof GRADES)[number];

/**
 * Kullanıcılar çocuk olduğu için kişisel veri en aza indirilir: e-posta, doğum tarihi vb. tutulmaz.
 */
export type User = {
  id: string;
  username: string;
  name: string;
  grade: Grade;
};

export type SignInInput = {
  username: string;
  password: string;
};

export type SignUpInput = SignInInput & {
  name: string;
  grade: Grade;
};

export type AuthResponse = {
  token: string;
  user: User;
};
