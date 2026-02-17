"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTHENTICATE = void 0;
exports.GET = GET;
exports.PUT = PUT;
const utils_1 = require("@medusajs/framework/utils");
exports.AUTHENTICATE = false;
async function GET(req, res) {
    console.log("Route [DEBUG]: /store/customers/me hit");
    console.log("Route [DEBUG]: Headers:", JSON.stringify(req.headers));
    console.log("Route [DEBUG]: Auth Context:", JSON.stringify(req.auth_context));
    const authIdentityId = req.auth_context?.auth_identity_id;
    if (!authIdentityId) {
        console.log("Route [DEBUG]: Missing authIdentityId, returning 401");
        return res.status(401).json({ message: "Unauthorized" });
    }
    const customerService = req.scope.resolve(utils_1.Modules.CUSTOMER);
    const authService = req.scope.resolve(utils_1.Modules.AUTH);
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
        }
        else {
            // 3. Create customer if not found, using the real email
            console.log("Creating new customer for:", email);
            customer = await customerService.createCustomers({
                email: email,
                has_account: true
            });
        }
        res.json({ customer });
    }
    catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: "Failed to fetch profile", error: error.message });
    }
}
async function PUT(req, res) {
    const authIdentityId = req.auth_context?.auth_identity_id;
    if (!authIdentityId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const customerService = req.scope.resolve(utils_1.Modules.CUSTOMER);
    const authService = req.scope.resolve(utils_1.Modules.AUTH);
    const { first_name, last_name, phone } = req.body;
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
        }
        else {
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
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2F1dGgvbWUvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBTUEsa0JBMERDO0FBRUQsa0JBK0NDO0FBaEhELHFEQUFvRDtBQUV2QyxRQUFBLFlBQVksR0FBRyxLQUFLLENBQUM7QUFHM0IsS0FBSyxVQUFVLEdBQUcsQ0FBQyxHQUFrQixFQUFFLEdBQW1CO0lBQy9ELE9BQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLENBQUMsQ0FBQztJQUN0RCxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDcEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBRTlFLE1BQU0sY0FBYyxHQUFHLEdBQUcsQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLENBQUM7SUFFMUQsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0RBQXNELENBQUMsQ0FBQztRQUNwRSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELE1BQU0sZUFBZSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM1RCxNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFcEQsSUFBSSxDQUFDO1FBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FB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