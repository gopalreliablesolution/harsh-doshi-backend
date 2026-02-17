"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = linkRazorpay;
const utils_1 = require("@medusajs/framework/utils");
const core_flows_1 = require("@medusajs/medusa/core-flows");
async function linkRazorpay({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    logger.info("Fetching India region...");
    const { data: regions } = await query.graph({
        entity: "region",
        fields: ["id", "name"],
        filters: {
            name: "India"
        }
    });
    if (regions.length === 0) {
        logger.error("India region not found.");
        return;
    }
    const region = regions[0];
    logger.info(`Linking Razorpay to ${region.name} (${region.id})...`);
    try {
        await (0, core_flows_1.updateRegionsWorkflow)(container).run({
            input: {
                selector: {
                    id: region.id
                },
                update: {
                    payment_providers: ["pp_razorpay_razorpay", "pp_system_default"]
                }
            }
        });
        logger.info("Successfully linked Razorpay to India region.");
    }
    catch (error) {
        logger.error(`Failed to link Razorpay: ${error.message}`);
    }
    logger.info("Finished script.");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluay1yYXpvcnBheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL2xpbmstcmF6b3JwYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSwrQkF1Q0M7QUExQ0QscURBQXNFO0FBQ3RFLDREQUFvRTtBQUVyRCxLQUFLLFVBQVUsWUFBWSxDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQzlELE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkUsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVqRSxNQUFNLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7SUFFeEMsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDeEMsTUFBTSxFQUFFLFFBQVE7UUFDaEIsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztRQUN0QixPQUFPLEVBQUU7WUFDTCxJQUFJLEVBQUUsT0FBTztTQUNoQjtLQUNKLENBQUMsQ0FBQztJQUVILElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUN2QixNQUFNLENBQUMsS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDeEMsT0FBTztJQUNYLENBQUM7SUFFRCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsTUFBTSxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUVwRSxJQUFJLENBQUM7UUFDRCxNQUFNLElBQUEsa0NBQXFCLEVBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQ3ZDLEtBQUssRUFBRTtnQkFDSCxRQUFRLEVBQUU7b0JBQ04sRUFBRSxFQUFFLE1BQU0sQ0FBQyxFQUFFO2lCQUNoQjtnQkFDRCxNQUFNLEVBQUU7b0JBQ0osaUJBQWlCLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxtQkFBbUIsQ0FBQztpQkFDbkU7YUFDSjtTQUNKLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsK0NBQStDLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNiLE1BQU0sQ0FBQyxLQUFLLENBQUMsNEJBQTRCLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDcEMsQ0FBQyJ9