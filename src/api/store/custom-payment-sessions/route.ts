// import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export async function OPTIONS(req: any, res: any) {
    res.set("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, x-publishable-api-key");
    res.set("Access-Control-Allow-Credentials", "true");
    res.sendStatus(204);
}

export async function POST(req: any, res: any) {
    // Manual CORS for POST as well
    res.set("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.set("Access-Control-Allow-Credentials", "true");

    const { cart_id, action, provider_id, data } = req.body as {
        cart_id: string;
        action?: string;
        provider_id?: string;
        data?: any;
    };

    if (!cart_id) {
        res.status(400).json({ message: "cart_id is required" });
        return;
    }

    try {
        const backendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";
        const apiKey = req.headers["x-publishable-api-key"] as string;

        // Handle different actions
        if (action === "select") {
            console.log(`[custom-payment-sessions] Action: select, Provider: ${provider_id}, Cart: ${cart_id}`);

            // For select, just return the cart - no action needed
            const cartResponse = await fetch(`${backendUrl}/store/carts/${cart_id}`, {
                headers: {
                    "x-publishable-api-key": apiKey || ""
                }
            });
            const cartData = await cartResponse.json() as any;

            if (cartData.cart && cartData.cart.payment_collection) {
                cartData.cart.payment_sessions = cartData.cart.payment_collection.payment_sessions;
            }

            console.log(`[custom-payment-sessions] Returning cart data for select action`);
            res.status(200).json(cartData);
            return;

        } else if (action === "update") {
            console.log(`[custom-payment-sessions] Action: update, Provider: ${provider_id}, Cart: ${cart_id}, Data:`, data);

            // Get the cart to find the payment collection and session
            const cartResponse = await fetch(`${backendUrl}/store/carts/${cart_id}`, {
                headers: {
                    "x-publishable-api-key": apiKey || ""
                }
            });
            const cartData = await cartResponse.json() as any;
            const collectionId = cartData.cart?.payment_collection?.id;
            const paymentSessions = cartData.cart?.payment_collection?.payment_sessions || [];

            if (!collectionId) {
                res.status(400).json({ message: "No payment collection found for cart" });
                return;
            }

            // Find the session with the matching provider_id
            const session = paymentSessions.find((s: any) => s.provider_id === provider_id);
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
                } catch (e) {
                    res.status(updateResponse.status).json({ message: "Upstream error (non-JSON)", body: errorText });
                }
                return;
            }

            const updateData = await updateResponse.json() as any;
            console.log(`[custom-payment-sessions] Session updated successfully`);
            res.status(200).json(updateData);
            return;

        } else {
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

            const collectionData = await collectionResponse.json() as any;
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

            const sessionData = await sessionResponse.json() as any;
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

            const cartData = await cartResponse.json() as any;

            // Medusa v2 returns payment_collection.payment_sessions
            // The frontend expects cart.payment_sessions (v1 style) or handles the new structure.
            // Let's ensure cartData.cart.payment_sessions exists for backward compatibility if needed.
            if (cartData.cart && cartData.cart.payment_collection) {
                cartData.cart.payment_sessions = cartData.cart.payment_collection.payment_sessions;
            }

            res.status(200).json(cartData);
        }

    } catch (error: any) {
        console.error("Proxy Error:", error);
        res.status(500).json({ message: "Internal Proxy Error", error: error.message });
    }
}
