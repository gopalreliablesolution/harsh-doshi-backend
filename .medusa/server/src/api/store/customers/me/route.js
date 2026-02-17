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
        // 1. Get the Auth Identity to find the real email
        console.log("Looking up AuthIdentity:", authIdentityId);
        const authIdentity = await authService.retrieveAuthIdentity(authIdentityId);
        console.log("Found AuthIdentity:", JSON.stringify(authIdentity, null, 2));
        // Get email from provider_identities
        const email = authIdentity.provider_identities?.[0]?.entity_id || authIdentity.entity_id;
        console.log("Extracted email:", email);
        if (!email) {
            console.error("No email found in identity");
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
        // 1. Get the Auth Identity to find the real email
        const authIdentity = await authService.retrieveAuthIdentity(authIdentityId);
        const email = authIdentity.provider_identities?.[0]?.entity_id || authIdentity.entity_id;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2N1c3RvbWVycy9tZS9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFNQSxrQkF3REM7QUFFRCxrQkE2Q0M7QUE1R0QscURBQW9EO0FBRXZDLFFBQUEsWUFBWSxHQUFHLEtBQUssQ0FBQztBQUczQixLQUFLLFVBQVUsR0FBRyxDQUFDLEdBQWtCLEVBQUUsR0FBbUI7SUFDL0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0lBQ3RELE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNwRSxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFFOUUsTUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQztJQUUxRCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO1FBQ3BFLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQsTUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzVELE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVwRCxJQUFJLENBQUM7UUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3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