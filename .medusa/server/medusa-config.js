"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
(0, utils_1.loadEnv)(process.env.NODE_ENV || 'development', process.cwd());
module.exports = (0, utils_1.defineConfig)({
    projectConfig: {
        databaseUrl: process.env.DATABASE_URL,
        // Commented out SSL for local development - uncomment for production with SSL
        databaseDriverOptions: {
            connection: {
                ssl: {
                    rejectUnauthorized: false
                }
            }
        },
        http: {
            storeCors: process.env.STORE_CORS,
            adminCors: process.env.ADMIN_CORS,
            authCors: process.env.AUTH_CORS,
            jwtSecret: process.env.JWT_SECRET || "supersecret",
            cookieSecret: process.env.COOKIE_SECRET || "supersecret",
                server_port: process.env.PORT || 9000, // Add this line

        }
    },
    modules: [
        {
            resolve: "@medusajs/medusa/auth",
            options: {
                providers: [
                    {
                        resolve: "@medusajs/medusa/auth-emailpass",
                        id: "emailpass",
                    },
                ],
            },
        },
        {
            resolve: "@medusajs/medusa/payment",
            options: {
                providers: [
                    {
                        resolve: "./src/modules/razorpay",
                        id: "razorpay",
                        options: {
                            key_id: process.env.RAZORPAY_KEY_ID,
                            key_secret: process.env.RAZORPAY_KEY_SECRET,
                            automatic_expiry_period: 30,
                            manual_expiry_period: 20,
                            refund_speed: "normal",
                            account_holder_name: "Harssh Doshi",
                        },
                    },
                ],
            },
        },
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkdXNhLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21lZHVzYS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBaUU7QUFFakUsSUFBQSxlQUFPLEVBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksYUFBYSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO0FBRTdELE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBQSxvQkFBWSxFQUFDO0lBQzVCLGFBQWEsRUFBRTtRQUNiLFdBQVcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVk7UUFDckMsOEVBQThFO1FBQzlFLHFCQUFxQixFQUFFO1lBQ3JCLFVBQVUsRUFBRTtnQkFDVixHQUFHLEVBQUU7b0JBQ0gsa0JBQWtCLEVBQUUsS0FBSztpQkFDMUI7YUFDRjtTQUNGO1FBQ0QsSUFBSSxFQUFFO1lBQ0osU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVztZQUNsQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFXO1lBQ2xDLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVU7WUFDaEMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLGFBQWE7WUFDbEQsWUFBWSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxJQUFJLGFBQWE7U0FDekQ7S0FDRjtJQUNELE9BQU8sRUFBRTtRQUNQO1lBQ0UsT0FBTyxFQUFFLHVCQUF1QjtZQUNoQyxPQUFPLEVBQUU7Z0JBQ1AsU0FBUyxFQUFFO29CQUNUO3dCQUNFLE9BQU8sRUFBRSxpQ0FBaUM7d0JBQzFDLEVBQUUsRUFBRSxXQUFXO3FCQUNoQjtpQkFDRjthQUNGO1NBQ0Y7UUFDRDtZQUNFLE9BQU8sRUFBRSwwQkFBMEI7WUFDbkMsT0FBTyxFQUFFO2dCQUNQLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxPQUFPLEVBQUUsd0JBQXdCO3dCQUNqQyxFQUFFLEVBQUUsVUFBVTt3QkFDZCxPQUFPLEVBQUU7NEJBQ1AsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZTs0QkFDbkMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1COzRCQUMzQyx1QkFBdUIsRUFBRSxFQUFFOzRCQUMzQixvQkFBb0IsRUFBRSxFQUFFOzRCQUN4QixZQUFZLEVBQUUsUUFBUTs0QkFDdEIsbUJBQW1CLEVBQUUsY0FBYzt5QkFDcEM7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0Y7Q0FDRixDQUFDLENBQUEifQ==
