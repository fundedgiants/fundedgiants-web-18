
import Checkout from "@/components/Checkout";
import { useLocation, Link } from 'react-router-dom';

const CheckoutPage = () => {
  const location = useLocation();
  // It's safer to provide default empty objects for destructuring
  const { program, addons = [] } = location.state || {};

  const handlePaymentSuccess = () => {
      // This function would typically redirect to a success page.
      console.log("Payment successful!");
  };
  
  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 max-w-md mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">No Program Selected</h1>
        <p className="mt-4 text-muted-foreground">
          It looks like you've landed on the checkout page without selecting a program first. Please go back and choose a program to continue.
        </p>
        <div className="mt-6">
          <Link
            to="/programs"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Browse Programs
          </Link>
        </div>
      </div>
    );
  }

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
