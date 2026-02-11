import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const authIdentityId = req.auth_context?.auth_identity_id;

  if (!authIdentityId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const customerService = req.scope.resolve(Modules.CUSTOMER);
  const orderService = req.scope.resolve(Modules.ORDER);

  try {
    // Find customer by email
    const customers = await customerService.listCustomers({ 
      email: authIdentityId 
    });
    
    if (!customers || customers.length === 0) {
      return res.json({ orders: [] });
    }

    const orders = await orderService.listOrders(
      { customer_id: customers[0].id },
      {
        relations: ["items", "shipping_address", "billing_address", "payment_collections"],
        order: { created_at: "DESC" },
      }
    );

    res.json({ orders });
  } catch (error) {
    console.error('Orders error:', error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
}
