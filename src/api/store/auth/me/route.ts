import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

export const AUTHENTICATE = false;


export async function GET(req: MedusaRequest, res: MedusaResponse) {
  console.log("Route [DEBUG]: /store/customers/me hit");
  console.log("Route [DEBUG]: Headers:", JSON.stringify(req.headers));
  console.log("Route [DEBUG]: Auth Context:", JSON.stringify(req.auth_context));

  const authIdentityId = req.auth_context?.auth_identity_id;

  if (!authIdentityId) {
    console.log("Route [DEBUG]: Missing authIdentityId, returning 401");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const customerService = req.scope.resolve(Modules.CUSTOMER);
  const authService = req.scope.resolve(Modules.AUTH);

  try {
    console.log("Processing /me request");

    // 1. Get the provider identity to find the email
    console.log("Looking up provider identity for:", authIdentityId);
    const providerIdentities = await authService.listProviderIdentities({
      auth_identity_id: authIdentityId
    });
    console.log("Provider identities:", JSON.stringify(providerIdentities, null, 2));

    // Extract email from the provider identity
    const email = providerIdentities?.[0]?.entity_id;
    console.log("Extracted email:", email);

    if (!email) {
      console.error("No email found in provider identities");
      return res.status(400).json({ message: "No email associated with this account" });
    }

    // 2. Try to find customer by the REAL email
    console.log("Listing customers with email:", email);
    const customers = await customerService.listCustomers({
      email: email
    });
    console.log("Customers found:", customers?.length || 0);

    let customer;
    if (customers && customers.length > 0) {
      customer = customers[0];
    } else {
      // 3. Create customer if not found, using the real email
      console.log("Creating new customer for:", email);
      customer = await customerService.createCustomers({
        email: email,
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
  const authService = req.scope.resolve(Modules.AUTH);
  const { first_name, last_name, phone } = req.body as { first_name?: string; last_name?: string; phone?: string };

  try {
    // 1. Get the provider identity to find the email
    const providerIdentities = await authService.listProviderIdentities({
      auth_identity_id: authIdentityId
    });
    const email = providerIdentities?.[0]?.entity_id;

    // 2. Find customer by email
    const customers = await customerService.listCustomers({
      email: email
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
        email: email,
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
