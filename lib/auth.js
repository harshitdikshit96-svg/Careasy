export function isAuthenticated(request) {
  return request.cookies.get("authenticated")?.value === "true";
}
