"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
(0, utils_1.loadEnv)(process.env.NODE_ENV || 'development', process.cwd());
module.exports = (0, utils_1.defineConfig)({
    projectConfig: {
        databaseUrl: process.env.DATABASE_URL,
        // Commented out SSL for local development - uncomment for production with SSL
        // databaseDriverOptions: {
        //   connection: {
        //     ssl: {
        //       rejectUnauthorized: false
        //     }
        //   }
        // },
        http: {
            storeCors: process.env.STORE_CORS,
            adminCors: process.env.ADMIN_CORS,
            authCors: process.env.AUTH_CORS,
            jwtSecret: process.env.JWT_SECRET || "supersecret",
            cookieSecret: process.env.COOKIE_SECRET || "supersecret",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkdXNhLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21lZHVzYS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBaUU7QUFFakUsSUFBQSxlQUFPLEVBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksYUFBYSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO0FBRTdELE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBQSxvQkFBWSxFQUFDO0lBQzVCLGFBQWEsRUFBRTtRQUNiLFdBQVcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVk7UUFDckMsOEVBQThFO1FBQzlFLDJCQUEyQjtRQUMzQixrQkFBa0I7UUFDbEIsYUFBYTtRQUNiLGtDQUFrQztRQUNsQyxRQUFRO1FBQ1IsTUFBTTtRQUNOLEtBQUs7UUFDTCxJQUFJLEVBQUU7WUFDSixTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFXO1lBQ2xDLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVc7WUFDbEMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBVTtZQUNoQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksYUFBYTtZQUNsRCxZQUFZLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLElBQUksYUFBYTtTQUN6RDtLQUNGO0lBQ0QsT0FBTyxFQUFFO1FBQ1A7WUFDRSxPQUFPLEVBQUUsdUJBQXVCO1lBQ2hDLE9BQU8sRUFBRTtnQkFDUCxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsT0FBTyxFQUFFLGlDQUFpQzt3QkFDMUMsRUFBRSxFQUFFLFdBQVc7cUJBQ2hCO2lCQUNGO2FBQ0Y7U0FDRjtRQUNEO1lBQ0UsT0FBTyxFQUFFLDBCQUEwQjtZQUNuQyxPQUFPLEVBQUU7Z0JBQ1AsU0FBUyxFQUFFO29CQUNUO3dCQUNFLE9BQU8sRUFBRSx3QkFBd0I7d0JBQ2pDLEVBQUUsRUFBRSxVQUFVO3dCQUNkLE9BQU8sRUFBRTs0QkFDUCxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlOzRCQUNuQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUI7NEJBQzNDLHVCQUF1QixFQUFFLEVBQUU7NEJBQzNCLG9CQUFvQixFQUFFLEVBQUU7NEJBQ3hCLFlBQVksRUFBRSxRQUFROzRCQUN0QixtQkFBbUIsRUFBRSxjQUFjO3lCQUNwQztxQkFDRjtpQkFDRjthQUNGO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQSJ9