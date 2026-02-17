"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_1 = __importDefault(require("razorpay"));
const utils_1 = require("@medusajs/utils");
class RazorpayProviderService extends utils_1.AbstractPaymentProvider {
    constructor(container, options) {
        super(container, options);
        this.razorpay_ = new razorpay_1.default({
            key_id: options.key_id,
            key_secret: options.key_secret,
        });
    }
    async capturePayment(input) {
        const data = input.data || {};
        const { razorpay_payment_id } = data;
        const externalId = razorpay_payment_id;
        const currency = data.currency || "INR";
        const amountInput = input.amount;
        const amountValue = typeof amountInput === 'string' ? parseFloat(amountInput) : Number(amountInput);
        const amount = Math.round(amountValue * 100);
        if (!externalId) {
            throw new Error("No Razorpay Payment ID found in session data");
        }
        try {
            const payment = await this.razorpay_.payments.capture(externalId, amount, currency.toUpperCase());
            return {
                data: {
                    ...data,
                    status: "captured",
                    captured_amount: payment.amount
                }
            };
        }
        catch (error) {
            if (error.error && error.error.description === 'This payment has already been captured') {
                return {
                    data: {
                        ...data,
                        status: "captured"
                    }
                };
            }
            throw new Error(error.message);
        }
    }
    async authorizePayment(input) {
        const data = input.data;
        const { razorpay_payment_id, razorpay_signature } = data;
        // If we have payment ID, we consider it authorized
        if (razorpay_payment_id) {
            return {
                status: utils_1.PaymentSessionStatus.AUTHORIZED,
                data: {
                    ...data,
                    status: "authorized"
                }
            };
        }
        return {
            status: utils_1.PaymentSessionStatus.PENDING,
            data: data
        };
    }
    async cancelPayment(input) {
        return { data: input.data };
    }
    async initiatePayment(input) {
        const { amount, currency_code } = input;
        const amountValue = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
        const amountInPaise = Math.round(amountValue * 100);
        console.log('Razorpay initiatePayment - Input amount:', amount, 'Converted to paise:', amountInPaise);
        try {
            const order = await this.razorpay_.orders.create({
                amount: amountInPaise,
                currency: currency_code.toUpperCase(),
                receipt: "receipt_" + Date.now(),
            });
            console.log('Razorpay order created:', order.id, 'Amount:', order.amount);
            return {
                id: order.id,
                data: {
                    id: order.id,
                    amount: order.amount,
                    currency: order.currency
                }
            };
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async deletePayment(input) {
        return { data: input.data };
    }
    async getPaymentStatus(input) {
        const status = input.data.status;
        if (status === "authorized")
            return { status: utils_1.PaymentSessionStatus.AUTHORIZED };
        if (status === "captured")
            return { status: utils_1.PaymentSessionStatus.CAPTURED };
        return { status: utils_1.PaymentSessionStatus.PENDING };
    }
    async refundPayment(input) {
        return { data: input.data };
    }
    async retrievePayment(input) {
        return { data: input.data };
    }
    async updatePayment(input) {
        // If we are just updating data (like adding payment_id), return new data
        // But updatePayment is usually for amount updates.
        // If input.data contains razorpay details, we should keep them.
        // Ideally we should create a new order if amount changed significantly.
        return { data: input.data };
    }
    async getWebhookActionAndData(payload) {
        return {
            action: "not_supported",
            data: {
                session_id: "",
                amount: 0
            }
        };
    }
}
RazorpayProviderService.identifier = "razorpay";
exports.default = RazorpayProviderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3Jhem9ycGF5L3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSx3REFBZ0M7QUFDaEMsMkNBQWdGO0FBb0NoRixNQUFNLHVCQUF3QixTQUFRLCtCQUF3QztJQUkxRSxZQUFZLFNBQWMsRUFBRSxPQUF3QjtRQUNoRCxLQUFLLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxrQkFBUSxDQUFDO1lBQzFCLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtZQUN0QixVQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVU7U0FDakMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBMEI7UUFDM0MsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7UUFDOUIsTUFBTSxFQUFFLG1CQUFtQixFQUFFLEdBQUcsSUFBVyxDQUFDO1FBQzVDLE1BQU0sVUFBVSxHQUFHLG1CQUE2QixDQUFDO1FBQ2pELE1BQU0sUUFBUSxHQUFJLElBQUksQ0FBQyxRQUFtQixJQUFJLEtBQUssQ0FBQztRQUNwRCxNQUFNLFdBQVcsR0FBSSxLQUFhLENBQUMsTUFBTSxDQUFDO1FBQzFDLE1BQU0sV0FBVyxHQUFHLE9BQU8sV0FBVyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDcEcsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFFN0MsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1FB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