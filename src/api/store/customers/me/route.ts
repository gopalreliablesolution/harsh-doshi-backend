import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const authIdentityId = req.auth_context?.auth_identity_id;
  const actorId = req.auth_context?.actor_id;

  if (!authIdentityId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const customerService = req.scope.resolve(Modules.CUSTOMER);

  try {
    // Try to find customer by email (auth_identity_id is the email)
    const customers = await customerService.listCustomers({ 
      email: authIdentityId 
    });
    
    let customer;
    if (customers && customers.length > 0) {
      customer = customers[0];
    } else {
      // Create customer if doesn't exist
      customer = await customerService.createCustomers({
        email: authIdentityId,
        has_account: true
      });
    }
    
    res.json({ customer });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const authIdentityId = req.auth_context?.auth_identity_id;

  if (!authIdentityId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const customerService = req.scope.resolve(Modules.CUSTOMER);
  const { first_name, last_name, phone } = req.body as { first_name?: string; last_name?: string; phone?: string };

  try {
    // Find customer by email
    const customers = await customerService.listCustomers({ 
      email: authIdentityId 
    });
    
    let customer;
    if (customers && customers.length > 0) {
      // Update existing customer
      customer = await customerService.updateCustomers(customers[0].id, {
        first_name,
        last_name,
        phone,
      });
    } else {
      // Create customer if doesn't exist
      customer = await customerService.createCustomers({
        email: authIdentityId,
        has_account: true,
        first_name,
        last_name,
        phone
      });
    }

    res.json({ customer });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
}
