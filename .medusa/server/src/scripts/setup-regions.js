"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setupRegions;
const utils_1 = require("@medusajs/framework/utils");
const core_flows_1 = require("@medusajs/medusa/core-flows");
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const core_flows_2 = require("@medusajs/medusa/core-flows");
// Define the workflow to update store currencies
const updateStoreCurrencies = (0, workflows_sdk_1.createWorkflow)("update-store-currencies", (input) => {
    const normalizedInput = (0, workflows_sdk_1.transform)({ input }, (data) => {
        return {
            selector: { id: data.input.store_id },
            update: {
                supported_currencies: data.input.supported_currencies.map((currency) => {
                    return {
                        currency_code: currency.currency_code,
                        is_default: currency.is_default ?? false,
                    };
                }),
            },
        };
    });
    const stores = (0, core_flows_2.updateStoresStep)(normalizedInput);
    return new workflows_sdk_1.WorkflowResponse(stores);
});
async function setupRegions({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const storeModuleService = container.resolve(utils_1.Modules.STORE);
    const regionModuleService = container.resolve(utils_1.Modules.REGION);
    logger.info("Starting region customization...");
    // 1. Get the default store
    const [store] = await storeModuleService.listStores();
    logger.info(`Found store: ${store.id}`);
    // 2. Update Store Currencies (Add INR and USD)
    logger.info("Updating store currencies to include INR and USD...");
    await updateStoreCurrencies(container).run({
        input: {
            store_id: store.id,
            supported_currencies: [
                { currency_code: "inr", is_default: true }, // Make INR default? Or USD? Let's make INR default for now as user asked for India.
                { currency_code: "usd" },
                { currency_code: "eur" }, // Keep EUR just in case
            ],
        },
    });
    // 3. Create/Update Regions
    // INDIA REGION
    logger.info("Creating 'India' region...");
    // Check if it already exists to avoid duplicates (naive check by name)
    const [existingIndia] = await regionModuleService.listRegions({ name: "India" });
    if (!existingIndia) {
        const { result: indiaRegionResult } = await (0, core_flows_1.createRegionsWorkflow)(container).run({
            input: {
                regions: [
                    {
                        name: "India",
                        currency_code: "inr",
                        countries: ["in"],
                        payment_providers: ["pp_razorpay_razorpay", "pp_system_default"], // Add razorpay if available
                    },
                ],
            },
        });
        logger.info(`Created India Region: ${indiaRegionResult[0].id}`);
    }
    else {
        logger.info(`India Region already exists: ${existingIndia.id}`);
    }
    // INTERNATIONAL REGION
    logger.info("Creating 'International' region...");
    const [existingIntl] = await regionModuleService.listRegions({ name: "International" });
    if (!existingIntl) {
        const { result: intlRegionResult } = await (0, core_flows_1.createRegionsWorkflow)(container).run({
            input: {
                regions: [
                    {
                        name: "International",
                        currency_code: "usd",
                        // Add a few common countries for International
                        countries: ["us", "gb", "ca", "au", "ae"],
                        payment_providers: ["pp_razorpay_razorpay", "pp_system_default"],
                    },
                ],
            },
        });
        logger.info(`Created International Region: ${intlRegionResult[0].id}`);
    }
    else {
        logger.info(`International Region already exists: ${existingIntl.id}`);
    }
    logger.info("Region setup complete!");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtcmVnaW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL3NldHVwLXJlZ2lvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFzQ0EsK0JBeUVDO0FBOUdELHFEQUErRTtBQUMvRSw0REFHcUM7QUFDckMscUVBQWdHO0FBQ2hHLDREQUErRDtBQUUvRCxpREFBaUQ7QUFDakQsTUFBTSxxQkFBcUIsR0FBRyxJQUFBLDhCQUFjLEVBQ3hDLHlCQUF5QixFQUN6QixDQUFDLEtBR0EsRUFBRSxFQUFFO0lBQ0QsTUFBTSxlQUFlLEdBQUcsSUFBQSx5QkFBUyxFQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNsRCxPQUFPO1lBQ0gsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQ3JDLE1BQU0sRUFBRTtnQkFDSixvQkFBb0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FDckQsQ0FBQyxRQUFRLEVBQUUsRUFBRTtvQkFDVCxPQUFPO3dCQUNILGFBQWEsRUFBRSxRQUFRLENBQUMsYUFBYTt3QkFDckMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxVQUFVLElBQUksS0FBSztxQkFDM0MsQ0FBQztnQkFDTixDQUFDLENBQ0o7YUFDSjtTQUNKLENBQUM7SUFDTixDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sTUFBTSxHQUFHLElBQUEsNkJBQWdCLEVBQUMsZUFBZSxDQUFDLENBQUM7SUFFakQsT0FBTyxJQUFJLGdDQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hDLENBQUMsQ0FDSixDQUFDO0FBRWEsS0FBSyxVQUFVLFlBQVksQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUM5RCxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFD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