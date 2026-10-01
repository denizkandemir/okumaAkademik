/** İstemciye dönen kullanıcı. `passwordHash` gibi alanlar asla buraya eklenmemeli. */
export type PublicUser = {
  id: string;
  username: string;
  name: string;
  grade: number;
};

export const publicUserSelect = {
  id: true,
  username: true,
  name: true,
  grade: true,
} as const;

export function toPublicUser(user: PublicUser): PublicUser {
  return { id: user.id, username: user.username, name: user.name, grade: user.grade };
}
