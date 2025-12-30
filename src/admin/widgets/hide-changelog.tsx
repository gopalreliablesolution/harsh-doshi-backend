import { defineWidgetConfig } from "@medusajs/admin-sdk"

const HideChangelogWidget = () => {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      a[href*="medusajs.com/changelog"] {
        display: none !important;
      }
    `}} />
  )
}

export const config = defineWidgetConfig({
  zone: ["order.list.before", "product.list.before", "customer.list.before"],
})

export default HideChangelogWidget
