"use strict";
// import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPTIONS = OPTIONS;
exports.POST = POST;
async function OPTIONS(req, res) {
    res.set("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, x-publishable-api-key");
    res.set("Access-Control-Allow-Credentials", "true");
    res.sendStatus(204);
}
async function POST(req, res) {
    // Manual CORS for POST as well
    res.set("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.set("Access-Control-Allow-Credentials", "true");
    const { cart_id, action, provider_id, data } = req.body;
    if (!cart_id) {
        res.status(400).json({ message: "cart_id is required" });
        return;
    }
    try {
        const backendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";
        const apiKey = req.headers["x-publishable-api-key"];
        // Handle different actions
        if (action === "select") {
            console.log(`[custom-payment-sessions] Action: select, Provider: ${provider_id}, Cart: ${cart_id}`);
            // For select, just return the cart - no action needed
            const cartResponse = await fetch(`${backendUrl}/store/carts/${cart_id}`, {
                headers: {
                    "x-publishable-api-key": apiKey || ""
                }
            });
            const cartData = await cartResponse.json();
            if (cartData.cart && cartData.cart.payment_collection) {
                cartData.cart.payment_sessions = cartData.cart.payment_collection.payment_sessions;
            }
            console.log(`[custom-payment-sessions] Returning cart data for select action`);
            res.status(200).json(cartData);
            return;
        }
        else if (action === "update") {
            console.log(`[custom-payment-sessions] Action: update, Provider: ${provider_id}, Cart: ${cart_id}, Data:`, data);
            // Get the cart to find the payment collection and session
            const cartResponse = await fetch(`${backendUrl}/store/carts/${cart_id}`, {
                headers: {
                    "x-publishable-api-key": apiKey || ""
                }
            });
            const cartData = await cartResponse.json();
            const collectionId = cartData.cart?.payment_collection?.id;
            const paymentSessions = cartData.cart?.payment_collection?.payment_sessions || [];
            if (!collectionId) {
                res.status(400).json({ message: "No payment collection found for cart" });
                return;
            }
            // Find the session with the matching provider_id
            const session = paymentSessions.find((s) => s.provider_id === provider_id);
            if (!session) {
                res.status(400).json({ message: `No payment session found for provider ${provider_id}` });
                return;
            }
            console.log(`[custom-payment-sessions] Updating session ${session.id} with Razorpay payment data`);
            // Update the payment session with Razorpay payment details
            // The correct endpoint in Medusa v2 store API is POST /store/payment-collections/:id/payment-sessions
            // This creates or updates a session for the provider.
            const updateResponse = await fetch(`${backendUrl}/store/payment-collections/${collectionId}/payment-sessions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-publishable-api-key": apiKey || ""
                },
                body: JSON.stringify({ provider_id, data })
            });
            if (!updateResponse.ok) {
                const errorText = await updateResponse.text();
                console.error(`[custom-payment-sessions] Session update failed with status ${updateResponse.status}. Body:`, errorText);
                try {
                    const errorData = JSON.parse(errorText);
                    res.status(updateResponse.status).json(errorData);
                }
                catch (e) {
                    res.status(updateResponse.status).json({ message: "Upstream error (non-JSON)", body: errorText });
                }
                return;
            }
            const updateData = await updateResponse.json();
            console.log(`[custom-payment-sessions] Session updated successfully`);
            res.status(200).json(updateData);
            return;
        }
        else {
            // Default: Create payment sessions
            console.log(`Step 1: Creating/Retrieving Payment Collection for cart: ${cart_id}`);
            const collectionResponse = await fetch(`${backendUrl}/store/payment-collections`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-publishable-api-key": apiKey || ""
                },
                body: JSON.stringify({ cart_id })
            });
            const collectionData = await collectionResponse.json();
            if (!collectionResponse.ok) {
                console.error("Collection creation failed:", collectionData);
                res.status(collectionResponse.status).json(collectionData);
                return;
            }
            const collectionId = collectionData.payment_collection.id;
            const providerId = "pp_razorpay_razorpay";
            console.log(`Step 2: Creating Payment Session for collection: ${collectionId} with provider: ${providerId}`);
            const sessionResponse = await fetch(`${backendUrl}/store/payment-collections/${collectionId}/payment-sessions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-publishable-api-key": apiKey || ""
                },
                body: JSON.stringify({ provider_id: providerId })
            });
            const sessionData = await sessionResponse.json();
            if (!sessionResponse.ok) {
                console.error("Session creation failed:", sessionData);
                res.status(sessionResponse.status).json(sessionData);
                return;
            }
            console.log("Step 3: Fetching finalized cart with payment sessions");
            const cartResponse = await fetch(`${backendUrl}/store/carts/${cart_id}`, {
                headers: {
                    "x-publishable-api-key": apiKey || ""
                }
            });
            const cartData = await cartResponse.json();
            // Medusa v2 returns payment_collection.payment_sessions
            // The frontend expects cart.payment_sessions (v1 style) or handles the new structure.
            // Let's ensure cartData.cart.payment_sessions exists for backward compatibility if needed.
            if (cartData.cart && cartData.cart.payment_collection) {
                cartData.cart.payment_sessions = cartData.cart.payment_collection.payment_sessions;
            }
            res.status(200).json(cartData);
        }
    }
    catch (error) {
        console.error("Proxy Error:", error);
        res.status(500).json({ message: "Internal Proxy Error", error: error.message });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2N1c3RvbS1wYXltZW50LXNlc3Npb25zL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvRUFBb0U7O0FBRXBFLDBCQU1DO0FBRUQsb0JBK0pDO0FBdktNLEtBQUssVUFBVSxPQUFPLENBQUMsR0FBUSxFQUFFLEdBQVE7SUFDNUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNsRSxHQUFHLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ3pELEdBQUcsQ0FBQyxHQUFHLENBQUMsOEJBQThCLEVBQUUscUNBQXFDLENBQUMsQ0FBQztJQUMvRSxHQUFHLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3BELEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEIsQ0FBQztBQUVNLEtBQUssVUFBVSxJQUFJLENBQUMsR0FBUSxFQUFFLEdBQVE7SUFDekMsK0JBQStCO0lBQy9CLEdBQUcsQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUM7SUFDbEUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUVwRCxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBS2xELENBQUM7SUFFRixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDWCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxxQkFBcUIsRUFB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