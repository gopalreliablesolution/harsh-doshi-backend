"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTHENTICATE = void 0;
exports.GET = GET;
const utils_1 = require("@medusajs/framework/utils");
exports.AUTHENTICATE = false;
async function GET(req, res) {
    const authIdentityId = req.auth_context?.auth_identity_id;
    if (!authIdentityId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const orderService = req.scope.resolve(utils_1.Modules.ORDER);
    const authService = req.scope.resolve(utils_1.Modules.AUTH);
    const customerService = req.scope.resolve(utils_1.Modules.CUSTOMER);
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
    }
    catch (error) {
        console.error('Orders error:', error);
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2F1dGgvbWUvb3JkZXJzL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBLGtCQTZDQztBQWpERCxxREFBb0Q7QUFFdkMsUUFBQSxZQUFZLEdBQUcsS0FBSyxDQUFDO0FBRTNCLEtBQUssVUFBVSxHQUFHLENBQUMsR0FBa0IsRUFBRSxHQUFtQjtJQUM3RCxNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUMsWUFBWSxFQUFFLGdCQUFnQixDQUFDO0lBRTFELElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNsQixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0RCxNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEQsTUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRTVELElBQUksQ0FBQztRQUNELGlEQUFpRDtRQUNqRCxNQUFNLGtCQUFrQixHQUFHLE1BQU0sV0FBVyxDQUFDLHNCQUFzQixDQUFDO1lBQ2hFLGdCQUFnQixFQUFFLGNBQWM7U0FDbkMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUM7UUFFakQsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ1QsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSx1Q0FBdUMsRUFBRSxDQUFDLENBQUM7UUFDdEYsQ0FBQztRQUVELDRCQUE0QjtRQUM1QixNQUFNLFNBQVMsR0FBRyxNQUFNLGVBQWUsQ0FBQyxhQUFhLENBQUM7WUFDbEQsS0FBSyxFQUFFLEtBQUs7U0FDZixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDdkMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUVELGtDQUFrQztRQUNsQyxNQUFNLE1BQU0sR0FBRyxNQUFNLFlBQVksQ0FBQyxVQUFVLENBQUM7WUFDekMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1NBQy9CLEVBQUU7WUFDQyxTQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUM7WUFDcEIsS0FBSyxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTtZQUM3QixJQUFJLEVBQUUsRUFBRTtTQUNYLENBQUMsQ0FBQztRQUVILEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN0QyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDdEYsQ0FBQztBQUNMLENBQUMifQ==