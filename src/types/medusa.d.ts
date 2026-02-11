import { MedusaRequest as BaseMedusaRequest } from "@medusajs/framework/http";

declare module "@medusajs/framework/http" {
  interface MedusaRequest {
    auth_context?: {
      auth_identity_id?: string;
      actor_id?: string;
    };
  }
}
