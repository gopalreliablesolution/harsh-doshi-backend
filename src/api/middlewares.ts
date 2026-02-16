import { defineMiddlewares } from "@medusajs/framework/http";
import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/framework/http";
import { verify } from "jsonwebtoken";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

// Custom authentication middleware for customer endpoints
const authenticateCustomer = async (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  console.log("Middleware [DEBUG]: Request matched /store/customers/me*");
  console.log("Middleware [DEBUG]: Authorization Header:", req.headers.authorization);

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("Middleware [DEBUG]: No authorization header");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const matches = authHeader.match(/(\S+)\s+(\S+)/);
  if (!matches) {
    console.log("Middleware [DEBUG]: Invalid authorization header format");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const [, tokenType, token] = matches;

  if (tokenType.toLowerCase() !== "bearer") {
    console.log("Middleware [DEBUG]: Not a bearer token");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { projectConfig: { http } } = req.scope.resolve(ContainerRegistrationKeys.CONFIG_MODULE);

    if (!http.jwtSecret) {
      console.error("Middleware [DEBUG]: JWT secret not configured");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const verified = verify(token, http.jwtSecret) as any;

    console.log("Middleware [DEBUG]: Token verified:", JSON.stringify(verified));

    // Set auth_context even if actor_id is empty (for unregistered customers)
    if (verified.auth_identity_id && verified.actor_type === "customer") {
      (req as any).auth_context = {
        actor_id: verified.actor_id || "",
        actor_type: verified.actor_type,
        auth_identity_id: verified.auth_identity_id,
        app_metadata: verified.app_metadata || {},
        user_metadata: verified.user_metadata || {}
      };
      console.log("Middleware [DEBUG]: Auth context set:", JSON.stringify((req as any).auth_context));

      // Intercept response to see if route handler is called
      const originalStatus = res.status.bind(res);
      const originalJson = res.json.bind(res);

      res.status = function (code: number) {
        console.log(`Middleware [DEBUG]: Response status set to ${code}`);
        return originalStatus(code);
      };

      res.json = function (body: any) {
        console.log(`Middleware [DEBUG]: Response body:`, JSON.stringify(body));
        return originalJson(body);
      };

      return next();
    }

    console.log("Middleware [DEBUG]: Token missing required fields");
    return res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    console.error("Middleware [DEBUG]: Token verification failed:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/auth/me*",
      middlewares: [authenticateCustomer],
    },
  ],
});
