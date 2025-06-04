import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.1.0?target=deno";

const stripe = Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2022-11-15",
});

serve(async (req) => {
  try {
    const body = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: body.items.map((item: any) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // in cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${body.origin}/checkout/success`,
      cancel_url: `${body.origin}/checkout/cancel`,
    });

    return new Response(JSON.stringify({ id: session.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating Stripe Checkout session:", error);
    return new Response(
      JSON.stringify({ error: "Unable to create checkout session" }),
      { status: 500 }
    );
  }
});