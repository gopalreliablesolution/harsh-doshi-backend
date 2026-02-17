"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fetchTShirtPrices;
const utils_1 = require("@medusajs/framework/utils");
async function fetchTShirtPrices({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    logger.info("Fetching Medusa T-Shirt variants with prices...");
    const { data: products } = await query.graph({
        entity: "product",
        fields: ["id", "title", "variants.id", "variants.title", "variants.prices.amount", "variants.prices.currency_code"],
        filters: {
            title: "Medusa T-Shirt"
        }
    });
    if (products.length === 0) {
        logger.info("Medusa T-Shirt not found.");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2gtdHNoaXJ0LXByaWNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL2ZldGNoLXRzaGlydC1wcmljZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxvQ0FtQ0M7QUFyQ0QscURBQXNFO0FBRXZELEtBQUssVUFBVSxpQkFBaUIsQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUNuRSxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFakUsTUFBTSxDQUFDLElBQUksQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO0lBRS9ELE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3pDLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixFQUFFLHdCQUF3QixFQUFFLCtCQUErQixDQUFDO1FBQ25ILE9BQU8sRUFBRTtZQUNMLEtBQUssRUFBRSxnQkFBZ0I7U0FDMUI7S0FDSixDQUFDLENBQUM7SUFFSCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBQ3pDLE9BQU87SUFDWCxDQUFDO0lBRUQsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxPQUFPLENBQUMsS0FBSyxTQUFTLE9BQU8sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzdELEtBQUssTUFBTSxPQUFPLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxPQUFPLENBQUMsS0FBSyxTQUFTLE9BQU8sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sT0FBTyxHQUFJLE9BQWUsQ0FBQyxNQUFNLENBQUM7UUFDeEMsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNoQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUU7Z0JBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7WUFDakUsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO2FBQ0ksQ0FBQztZQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUN4QyxDQUFDO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNwQyxDQUFDIn0=