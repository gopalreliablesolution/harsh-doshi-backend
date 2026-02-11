import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container } from "@medusajs/ui"

// Info widget for order list
const OrderListInfo = () => {
  return (
    <Container className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
      <p className="text-sm text-blue-800">
        <strong>💡 Tip:</strong> To print an invoice, click on any order to view details, then use the "Print Invoice" button.
      </p>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.list.before",
})

export default OrderListInfo
