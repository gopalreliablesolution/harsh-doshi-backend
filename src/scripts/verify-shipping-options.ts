import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function verifyShippingOptions({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const pgConnection = container.resolve(ContainerRegistrationKeys.PG_CONNECTION);

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

    } catch (error) {
        logger.error(`Error: ${error.message}`);
    }
}
