
import Checkout from "@/components/Checkout";

const CheckoutPage = () => {
  // This is sample data. In a real application, you would likely pass this
  // data from a program selection page.
  const program = {
    id: "prog_heracles_100k",
    name: "Heracles Program ($100k Account)",
    price: 499,
  };

  const addons = [
    {
      id: "addon_1",
      name: "90% Profit Split",
      description: "Increase your profit share to 90%.",
      price: 99,
      selected: true, // This addon will appear in the summary
    },
    {
      id: "addon_2",
      name: "Refundable Fee",
      description: "Get your fee refunded on your first payout.",
      price: 50,
      selected: false, // This addon will not appear
    },
  ];

  const handlePaymentSuccess = () => {
      // This function would typically redirect to a success page.
      console.log("Payment successful!");
  };
  
  return (
      <div className="max-w-2xl mx-auto">
          <Checkout
              programId={program.id}
              programName={program.name}
              programPrice={program.price}
              addons={addons}
              onPaymentSuccess={handlePaymentSuccess}
          />
      </div>
  );
};

export default CheckoutPage;
