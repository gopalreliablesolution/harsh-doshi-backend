"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = verifyShippingOptions;
const utils_1 = require("@medusajs/framework/utils");
async function verifyShippingOptions({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const pgConnection = container.resolve(utils_1.ContainerRegistrationKeys.PG_CONNECTION);
    logger.info("Verifying Shipping Options via SQL...");
    try {
        const res = await pgConnection.raw(`
      SELECT 
        so.id,
        so.name,
        so.price_type,
        so.provider_id,
        sz.name as zone_name,
        p.currency_code,
        p.amount
      FROM shipping_option so
      LEFT JOIN service_zone sz ON so.service_zone_id = sz.id
      LEFT JOIN shipping_option_price_set sops ON so.id = sops.shipping_option_id
      LEFT JOIN price_set ps ON sops.price_set_id = ps.id
      LEFT JOIN price p ON p.price_set_id = ps.id
      ORDER BY so.name, p.currency_code
    `);
        logger.info(`Found ${res.rows.length} shipping option-price combinations:`);
        res.rows.forEach(row => {
            logger.info(`  📦 ${row.name} | Zone: ${row.zone_name} | ${row.currency_code?.toUpperCase() || 'N/A'}: ${row.amount || 'N/A'}`);
        });
    }
    catch (error) {
        logger.error(`Error: ${error.message}`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVyaWZ5LXNoaXBwaW5nLW9wdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy92ZXJpZnktc2hpcHBpbmctb3B0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLHdDQWlDQztBQW5DRCxxREFBc0U7QUFFdkQsS0FBSyxVQUFVLHFCQUFxQixDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQ3ZFLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkUsTUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUVoRixNQUFNLENBQUMsSUFBSSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7SUFFckQsSUFBSSxDQUFDO1FBQ0QsTUFBTSxHQUFHLEdBQUcsTUFBTSxZQUFZLENBQUMsR0FBRyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7S0FldEMsQ0FBQyxDQUFDO1FBRUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxzQ0FBc0MsQ0FBQyxDQUFDO1FBRTVFLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxZQUFZLEdBQUcsQ0FBQyxTQUFTLE1BQU0sR0FBRyxDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsSUFBSSxLQUFLLEtBQUssR0FBRyxDQUFDLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3BJLENBQUMsQ0FBQyxDQUFDO0lBRVAsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDYixNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDNUMsQ0FBQztBQUNMLENBQUMifQ==