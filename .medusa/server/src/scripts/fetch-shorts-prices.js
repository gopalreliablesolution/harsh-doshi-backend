"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fetchShortsPrices;
const utils_1 = require("@medusajs/framework/utils");
async function fetchShortsPrices({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    logger.info("Fetching Medusa Shorts variants with prices...");
    const { data: products } = await query.graph({
        entity: "product",
        fields: ["id", "title", "variants.id", "variants.title", "variants.prices.amount", "variants.prices.currency_code"],
        filters: {
            title: "Medusa Shorts"
        }
    });
    if (products.length === 0) {
        logger.info("Medusa Shorts not found.");
        return;
    }
    const product = products[0];
    logger.info(`Product: ${product.title} (ID: ${product.id})`);
    for (const variant of product.variants) {
        logger.info(`  Variant: ${variant.title} (ID: ${variant.id})`);
        const vPrices = variant.prices;
        if (vPrices && vPrices.length > 0) {
            vPrices.forEach((p) => {
                logger.info(`        Price: ${p.amount} ${p.currency_code}`);
            });
        }
        else {
            logger.info("    No prices found.");
        }
    }
    logger.info("Finished script.");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2gtc2hvcnRzLXByaWNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL2ZldGNoLXNob3J0cy1wcmljZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxvQ0FtQ0M7QUFyQ0QscURBQXNFO0FBRXZELEtBQUssVUFBVSxpQkFBaUIsQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUNuRSxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFakUsTUFBTSxDQUFDLElBQUksQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO0lBRTlELE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3pDLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixFQUFFLHdCQUF3QixFQUFFLCtCQUErQixDQUFDO1FBQ25ILE9BQU8sRUFBRTtZQUNMLEtBQUssRUFBRSxlQUFlO1NBQ3pCO0tBQ0osQ0FBQyxDQUFDO0lBRUgsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUN4QyxPQUFPO0lBQ1gsQ0FBQztJQUVELE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksT0FBTyxDQUFDLEtBQUssU0FBUyxPQUFPLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM3RCxLQUFLLE1BQU0sT0FBTyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsT0FBTyxDQUFDLEtBQUssU0FBUyxPQUFPLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMvRCxNQUFNLE9BQU8sR0FBSSxPQUFlLENBQUMsTUFBTSxDQUFDO1FBQ3hDLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDaEMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFO2dCQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1lBQ2pFLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQzthQUNJLENBQUM7WUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDeEMsQ0FBQztJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDcEMsQ0FBQyJ9