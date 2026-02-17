"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkKeyLinks;
const utils_1 = require("@medusajs/framework/utils");
async function checkKeyLinks({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    logger.info("Fetching publishable keys and their linked regions...");
    const { data: keys } = await query.graph({
        entity: "publishable_api_key",
        fields: ["id", "title", "token", "sales_channels.id", "sales_channels.name"],
    });
    for (const key of keys) {
        logger.info(`Key: ${key.title} (${key.id})`);
        logger.info(`  Token: ${key.token}`);
        if (key.sales_channels && key.sales_channels.length > 0) {
            key.sales_channels.forEach(sc => {
                logger.info(`  Sales Channel: ${sc.name} (${sc.id})`);
            });
        }
        else {
            logger.info("  No sales channels linked.");
        }
    }
    logger.info("Finished script.");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2sta2V5LWxpbmtzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvY2hlY2sta2V5LWxpbmtzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsZ0NBd0JDO0FBMUJELHFEQUFzRTtBQUV2RCxLQUFLLFVBQVUsYUFBYSxDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQy9ELE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkUsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVqRSxNQUFNLENBQUMsSUFBSSxDQUFDLHVEQUF1RCxDQUFDLENBQUM7SUFFckUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDckMsTUFBTSxFQUFFLHFCQUFxQjtRQUM3QixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxxQkFBcUIsQ0FBQztLQUMvRSxDQUFDLENBQUM7SUFFSCxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBSyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNyQyxJQUFJLEdBQUcsQ0FBQyxjQUFjLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDdEQsR0FBRyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDMUQsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO2FBQU0sQ0FBQztZQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUMvQyxDQUFDO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNwQyxDQUFDIn0=