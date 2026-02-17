"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
async function GET(req, res) {
    const emailEnabled = process.env.EMAIL_ENABLED === 'true' || process.env.EMAIL_ENABLED === 'on';
    res.json({
        emailEnabled,
        // Add other public configs here if needed 
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2VtYWlsLWNvbmZpZy9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLGtCQU9DO0FBUE0sS0FBSyxVQUFVLEdBQUcsQ0FBQyxHQUFrQixFQUFFLEdBQW1CO0lBQzdELE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxLQUFLLE1BQU0sSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUM7SUFFaEcsR0FBRyxDQUFDLElBQUksQ0FBQztRQUNMLFlBQVk7UUFDWiwyQ0FBMkM7S0FDOUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyJ9