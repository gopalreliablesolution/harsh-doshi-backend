import { authenticate } from "@medusajs/framework/http";

export const config = {
  routes: [
    {
      matcher: "/store/customers/me*",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
  ],
};
