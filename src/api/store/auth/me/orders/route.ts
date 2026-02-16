import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

export const AUTHENTICATE = false;

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    const authIdentityId = req.auth_context?.auth_identity_id;

    if (!authIdentityId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const orderService = req.scope.resolve(Modules.ORDER);
    const authService = req.scope.resolve(Modules.AUTH);
    const customerService = req.scope.resolve(Modules.CUSTOMER);

    try {
        // 1. Get the provider identity to find the email
        const providerIdentities = await authService.listProviderIdentities({
            auth_identity_id: authIdentityId
        });
        const email = providerIdentities?.[0]?.entity_id;

        if (!email) {
            return res.status(400).json({ message: "No email associated with this account" });
        }

        // 2. Find customer by email
        const customers = await customerService.listCustomers({
            email: email
        });

        if (!customers || customers.length === 0) {
            return res.json({ orders: [] });
        }

        // 3. Get orders for this customer
        const orders = await orderService.listOrders({
            customer_id: customers[0].id
        }, {
            relations: ["items"],
            order: { created_at: "DESC" },
            take: 20
        });

        res.json({ orders: orders || [] });
    } catch (error) {
        console.error('Orders error:', error);
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
}
