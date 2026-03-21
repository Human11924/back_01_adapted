export default function RoleGuard({ user, allowedRoles, children, fallback = null }) {
  if (!user) return fallback;
  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) return children;
  return allowedRoles.includes(user.role) ? children : fallback;
}
