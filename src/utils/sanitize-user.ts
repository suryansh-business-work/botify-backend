export const sanitizeUser = (user: any) => {
  if (!user) return null;
  const { password, __v, _id, ...rest } = user.toObject ? user.toObject() : user;
  return rest;
};
