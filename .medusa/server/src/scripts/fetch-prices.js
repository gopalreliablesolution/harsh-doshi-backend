"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fetchPrices;
const utils_1 = require("@medusajs/framework/utils");
async function fetchPrices({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    logger.info("Fetching variants with prices...");
    const { data: variants } = await query.graph({
        entity: "variant",
        fields: ["id", "title", "product.id", "prices.id", "prices.amount", "prices.currency_code"],
    });
    logger.info(`Found ${variants.length} variants.`);
    for (const variant of variants) {
        logger.info(`Variant: ${variant.title} (ID: ${variant.id})`);
        const vPrices = variant.prices;
        if (vPrices && vPrices.length > 0) {
            vPrices.forEach((p) => {
                logger.info(`        Price: ${p.amount} ${p.currency_code}`);
            });
        }
        else {
            logger.info("  No prices found.");
        }
    }
    logger.info("Finished script.");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2gtcHJpY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvZmV0Y2gtcHJpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsOEJBMkJDO0FBN0JELHFEQUFzRTtBQUV2RCxLQUFLLFVBQVUsV0FBVyxDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQzdELE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkUsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVqRSxNQUFNLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7SUFFaEQsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDekMsTUFBTSxFQUFFLFNBQVM7UUFDakIsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxzQkFBc0IsQ0FBQztLQUM5RixDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsUUFBUSxDQUFDLE1BQU0sWUFBWSxDQUFDLENBQUM7SUFFbEQsS0FBSyxNQUFNLE9BQU8sSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksT0FBTyxDQUFDLEtBQUssU0FBUyxPQUFPLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM3RCxNQUFNLE9BQU8sR0FBSSxPQUFlLENBQUMsTUFBTSxDQUFDO1FBQ3hDLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDaEMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFO2dCQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1lBQ2pFLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQzthQUNJLENBQUM7WUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDdEMsQ0FBQztJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDcEMsQ0FBQyJ9