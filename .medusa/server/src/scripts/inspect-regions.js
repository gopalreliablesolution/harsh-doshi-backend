"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = inspectRegions;
const utils_1 = require("@medusajs/framework/utils");
const core_flows_1 = require("@medusajs/medusa/core-flows");
async function inspectRegions({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const regionModuleService = container.resolve(utils_1.Modules.REGION);
    const storeModuleService = container.resolve(utils_1.Modules.STORE);
    logger.info("Inspecting regions...");
    const regions = await regionModuleService.listRegions();
    logger.info(`Found ${regions.length} regions:`);
    regions.forEach(r => {
        logger.info(`- ${r.name} (${r.currency_code}) ID: ${r.id}`);
    });
    const indiaRegion = regions.find(r => r.currency_code === "inr" || r.name.toLowerCase() === "india");
    if (!indiaRegion) {
        logger.info("India region not found. Creating it...");
        // Ensure INR is supported by the store
        const [store] = await storeModuleService.listStores();
        logger.info(`Store supported currencies: ${JSON.stringify(store.supported_currencies)}`);
        try {
            const { result } = await (0, core_flows_1.createRegionsWorkflow)(container).run({
                input: {
                    regions: [
                        {
                            name: "India",
                            currency_code: "inr",
                            countries: ["in"],
                            payment_providers: ["razorpay"],
                        },
                    ],
                },
            });
            logger.info(`India region created: ${result[0].id}`);
        }
        catch (error) {
            logger.error(`Failed to create India region: ${error.message}`);
        }
    }
    else {
        logger.info("India region already exists.");
        // Check if razorpay is in payment providers
        // Note: in Medusa 2.0, payment providers are linked differently, but this is a good start.
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zcGVjdC1yZWdpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvaW5zcGVjdC1yZWdpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsaUNBMkNDO0FBOUNELHFEQUErRTtBQUMvRSw0REFBb0U7QUFFckQsS0FBSyxVQUFVLGNBQWMsQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUNoRSxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLE1BQU0sbUJBQW1CLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUQsTUFBTSxrQkFBa0IsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUU1RCxNQUFNLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDckMsTUFBTSxPQUFPLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN4RCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsT0FBTyxDQUFDLE1BQU0sV0FBVyxDQUFDLENBQUM7SUFDaEQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsYUFBYSxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ2hFLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssT0FBTyxDQUFDLENBQUM7SUFFckcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1FBRXRELHVDQUF1QztRQUN2QyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN0RCxNQUFNLENBQUMsSUFBSSxDQUFDLCtCQUErQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV6RixJQUFJLENBQUM7WUFDRCxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFBLGtDQUFxQixFQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFDMUQsS0FBSyxFQUFFO29CQUNILE9BQU8sRUFBRTt3QkFDTDs0QkFDSSxJQUFJLEVBQUUsT0FBTzs0QkFDYixhQUFhLEVBQUUsS0FBSzs0QkFDcEIsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDOzRCQUNqQixpQkFBaUIsRUFBRSxDQUFDLFVBQVUsQ0FBQzt5QkFDbEM7cUJBQ0o7aUJBQ0o7YUFDSixDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLE1BQU0sQ0FBQyxLQUFLLENBQUMsa0NBQWtDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ3BFLENBQUM7SUFDTCxDQUFDO1NBQU0sQ0FBQztRQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUM1Qyw0Q0FBNEM7UUFDNUMsMkZBQTJGO0lBQy9GLENBQUM7QUFDTCxDQUFDIn0=