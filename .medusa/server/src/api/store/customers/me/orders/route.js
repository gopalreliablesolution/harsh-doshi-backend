"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const utils_1 = require("@medusajs/framework/utils");
async function GET(req, res) {
    const authIdentityId = req.auth_context?.auth_identity_id;
    if (!authIdentityId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const customerService = req.scope.resolve(utils_1.Modules.CUSTOMER);
    const orderService = req.scope.resolve(utils_1.Modules.ORDER);
    try {
        // Find customer by email
        const customers = await customerService.listCustomers({
            email: authIdentityId
        });
        if (!customers || customers.length === 0) {
            return res.json({ orders: [] });
        }
        const orders = await orderService.listOrders({ customer_id: customers[0].id }, {
            relations: ["items", "shipping_address", "billing_address", "payment_collections"],
            order: { created_at: "DESC" },
        });
        res.json({ orders });
    }
    catch (error) {
        console.error('Orders error:', error);
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2N1c3RvbWVycy9tZS9vcmRlcnMvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxrQkFpQ0M7QUFuQ0QscURBQW9EO0FBRTdDLEtBQUssVUFBVSxHQUFHLENBQUMsR0FBa0IsRUFBRSxHQUFtQjtJQUMvRCxNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUMsWUFBWSxFQUFFLGdCQUFnQixDQUFDO0lBRTFELElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNwQixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELE1BQU0sZUFBZSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM1RCxNQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFdEQsSUFBSSxDQUFDO1FBQ0gseUJBQXlCO1FBQ3pCLE1BQU0sU0FBUyxHQUFHLE1BQU0sZUFBZSxDQUFDLGFBQWEsQ0FBQztZQUNwRCxLQUFLLEVBQUUsY0FBYztTQUN0QixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDekMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUVELE1BQU0sTUFBTSxHQUFHLE1BQU0sWUFBWSxDQUFDLFVBQVUsQ0FDMUMsRUFBRSxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUNoQztZQUNFLFNBQVMsRUFBRSxDQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxpQkFBaUIsRUFBRSxxQkFBcUIsQ0FBQztZQUNsRixLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFO1NBQzlCLENBQ0YsQ0FBQztRQUVGLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ3BGLENBQUM7QUFDSCxDQUFDIn0=