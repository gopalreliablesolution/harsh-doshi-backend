import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import {
    createRegionsWorkflow,
    updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { createWorkflow, transform, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { updateStoresStep } from "@medusajs/medusa/core-flows";

// Define the workflow to update store currencies
const updateStoreCurrencies = createWorkflow(
    "update-store-currencies",
    (input: {
        supported_currencies: { currency_code: string; is_default?: boolean }[];
        store_id: string;
    }) => {
        const normalizedInput = transform({ input }, (data) => {
            return {
                selector: { id: data.input.store_id },
                update: {
                    supported_currencies: data.input.supported_currencies.map(
                        (currency) => {
                            return {
                                currency_code: currency.currency_code,
                                is_default: currency.is_default ?? false,
                            };
                        }
                    ),
                },
            };
        });

        const stores = updateStoresStep(normalizedInput);

        return new WorkflowResponse(stores);
    }
);

export default async function setupRegions({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const storeModuleService = container.resolve(Modules.STORE);
    const regionModuleService = container.resolve(Modules.REGION);

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
        const { result: indiaRegionResult } = await createRegionsWorkflow(container).run({
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
    } else {
        logger.info(`India Region already exists: ${existingIndia.id}`);
    }

    // INTERNATIONAL REGION
    logger.info("Creating 'International' region...");
    const [existingIntl] = await regionModuleService.listRegions({ name: "International" });

    if (!existingIntl) {
        const { result: intlRegionResult } = await createRegionsWorkflow(container).run({
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
    } else {
        logger.info(`International Region already exists: ${existingIntl.id}`);
    }

    logger.info("Region setup complete!");
}
