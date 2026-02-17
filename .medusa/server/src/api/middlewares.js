"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("@medusajs/framework/http");
const jsonwebtoken_1 = require("jsonwebtoken");
const utils_1 = require("@medusajs/framework/utils");
// Custom authentication middleware for customer endpoints
const authenticateCustomer = async (req, res, next) => {
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
        const { projectConfig: { http } } = req.scope.resolve(utils_1.ContainerRegistrationKeys.CONFIG_MODULE);
        if (!http.jwtSecret) {
            console.error("Middleware [DEBUG]: JWT secret not configured");
            return res.status(500).json({ message: "Server configuration error" });
        }
        const verified = (0, jsonwebtoken_1.verify)(token, http.jwtSecret);
        console.log("Middleware [DEBUG]: Token verified:", JSON.stringify(verified));
        // Set auth_context even if actor_id is empty (for unregistered customers)
        if (verified.auth_identity_id && verified.actor_type === "customer") {
            req.auth_context = {
                actor_id: verified.actor_id || "",
                actor_type: verified.actor_type,
                auth_identity_id: verified.auth_identity_id,
                app_metadata: verified.app_metadata || {},
                user_metadata: verified.user_metadata || {}
            };
            console.log("Middleware [DEBUG]: Auth context set:", JSON.stringify(req.auth_context));
            // Intercept response to see if route handler is called
            const originalStatus = res.status.bind(res);
            const originalJson = res.json.bind(res);
            res.status = function (code) {
                console.log(`Middleware [DEBUG]: Response status set to ${code}`);
                return originalStatus(code);
            };
            res.json = function (body) {
                console.log(`Middleware [DEBUG]: Response body:`, JSON.stringify(body));
                return originalJson(body);
            };
            return next();
        }
        console.log("Middleware [DEBUG]: Token missing required fields");
        return res.status(401).json({ message: "Unauthorized" });
    }
    catch (error) {
        console.error("Middleware [DEBUG]: Token verification failed:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
};
exports.default = (0, http_1.defineMiddlewares)({
    routes: [
        {
            matcher: "/store/auth/me*",
            middlewares: [authenticateCustomer],
        },
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpL21pZGRsZXdhcmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbURBQTZEO0FBRTdELCtDQUFzQztBQUN0QyxxREFBc0U7QUFFdEUsMERBQTBEO0FBQzFELE1BQU0sb0JBQW9CLEdBQUcsS0FBSyxFQUNoQyxHQUFrQixFQUNsQixHQUFtQixFQUNuQixJQUF3QixFQUN4QixFQUFFO0lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQywwREFBMEQsQ0FBQyxDQUFDO0lBQ3hFLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkNBQTJDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUVwRixNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztJQUU3QyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO1FBQzNELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUNsRCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLHlEQUF5RCxDQUFDLENBQUM7UUFDdkUsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCxNQUFNLENBQUMsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBRXJDLElBQUksU0FBUyxDQUFD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