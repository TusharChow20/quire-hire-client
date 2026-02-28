import { auth } from "@/auth";

export default auth((req) => {});

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/apply/:path*"],
};
