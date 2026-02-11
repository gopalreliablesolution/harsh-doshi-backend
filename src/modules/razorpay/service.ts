
import Razorpay from "razorpay";
import { AbstractPaymentProvider, PaymentSessionStatus } from "@medusajs/utils";
import {
    Logger,
    AuthorizePaymentInput,
    AuthorizePaymentOutput,
    CancelPaymentInput,
    CancelPaymentOutput,
    CapturePaymentInput,
    CapturePaymentOutput,
    DeletePaymentInput,
    DeletePaymentOutput,
    GetPaymentStatusInput,
    GetPaymentStatusOutput,
    InitiatePaymentInput,
    InitiatePaymentOutput,
    RefundPaymentInput,
    RefundPaymentOutput,
    RetrievePaymentInput,
    RetrievePaymentOutput,
    UpdatePaymentInput,
    UpdatePaymentOutput,
    ProviderWebhookPayload,
    WebhookActionResult
} from "@medusajs/types";


// Define options interface
interface RazorpayOptions {
    key_id: string;
    key_secret: string;
    automatic_expiry_period?: number;
    manual_expiry_period?: number;
    refund_speed?: string;
    account_holder_name?: string;
}

class RazorpayProviderService extends AbstractPaymentProvider<RazorpayOptions> {
    static identifier = "razorpay";
    protected razorpay_: any;

    constructor(container: any, options: RazorpayOptions) {
        super(container, options);
        this.razorpay_ = new Razorpay({
            key_id: options.key_id,
            key_secret: options.key_secret,
        });
    }

    async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
        const data = input.data || {};
        const { razorpay_payment_id } = data as any;
        const externalId = razorpay_payment_id as string;
        const currency = (data.currency as string) || "INR";
        const amountInput = (input as any).amount;
        const amountValue = typeof amountInput === 'string' ? parseFloat(amountInput) : Number(amountInput);
        const amount = Math.round(amountValue * 100);

        if (!externalId) {
            throw new Error("No Razorpay Payment ID found in session data");
        }

        try {
            const payment = await this.razorpay_.payments.capture(
                externalId,
                amount,
                currency.toUpperCase()
            );
            return {
                data: {
                    ...data,
                    status: "captured",
                    captured_amount: payment.amount
                }
            };
        } catch (error: any) {
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


    async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
        const data = input.data;
        const { razorpay_payment_id, razorpay_signature } = data as any;

        // If we have payment ID, we consider it authorized
        if (razorpay_payment_id) {
            return {
                status: PaymentSessionStatus.AUTHORIZED,
                data: {
                    ...data,
                    status: "authorized"
                }
            };
        }

        return {
            status: PaymentSessionStatus.PENDING,
            data: data
        };
    }

    async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
        return { data: input.data };
    }

    async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
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
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
        return { data: input.data };
    }

    async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
        const status = (input.data as any).status;
        if (status === "authorized") return { status: PaymentSessionStatus.AUTHORIZED };
        if (status === "captured") return { status: PaymentSessionStatus.CAPTURED };
        return { status: PaymentSessionStatus.PENDING };
    }

    async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
        return { data: input.data };
    }

    async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
        return { data: input.data };
    }

    async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
        // If we are just updating data (like adding payment_id), return new data
        // But updatePayment is usually for amount updates.
        // If input.data contains razorpay details, we should keep them.

        // Ideally we should create a new order if amount changed significantly.
        return { data: input.data };
    }

    async getWebhookActionAndData(payload: ProviderWebhookPayload["payload"]): Promise<WebhookActionResult> {
        return {
            action: "not_supported",
            data: {
                session_id: "",
                amount: 0
            }
        };
    }

}

export default RazorpayProviderService;
