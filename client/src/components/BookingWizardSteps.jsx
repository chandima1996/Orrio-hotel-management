import React from "react";
import { CheckCircle2, Wallet, CreditCard, Pencil } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Assuming you have this component from previous context
import StripePaymentForm from "./StripePaymentForm";

const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

// --- COMPONENT: Sidebar Summary ---
export const WizardSidebar = ({
  hotel,
  bookingSummary,
  currency,
  convertPrice,
  closeWizard,
}) => {
  return (
    <div className="flex flex-col justify-between p-6 overflow-y-auto border-r bg-slate-50 md:w-1/3">
      <div>
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          Complete your Booking
        </h2>
        <div className="space-y-4">
          {/* Hotel Details */}
          <div className="p-3 bg-white border rounded-lg shadow-sm">
            <h4 className="text-sm font-semibold text-gray-500 uppercase">
              Hotel
            </h4>
            <p className="font-bold text-gray-800">{hotel.name}</p>
            <p className="text-xs text-gray-500">{hotel.address}</p>
          </div>

          {/* Room Details */}
          <div className="p-3 bg-white border rounded-lg shadow-sm">
            <h4 className="mb-2 text-sm font-semibold text-gray-500 uppercase">
              Room Details
            </h4>
            <div className="space-y-3">
              {bookingSummary.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between pb-2 text-sm border-b border-gray-100 border-dashed last:border-0 last:pb-0"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{item.name}</span>
                    <span className="text-xs font-semibold text-primary">
                      x {item.qty} Room(s)
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {currency} {convertPrice(item.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Cost */}
          <div className="p-3 bg-white border rounded-lg shadow-sm">
            <h4 className="text-sm font-semibold text-gray-500 uppercase">
              Total Cost
            </h4>
            <p className="text-2xl font-extrabold text-primary">
              {currency} {convertPrice(bookingSummary.finalTotal)}
            </p>
            <p className="text-xs text-gray-500">Includes taxes & fees</p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <Button
          variant="outline"
          onClick={closeWizard}
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
        >
          Cancel Booking
        </Button>
      </div>
    </div>
  );
};

// --- COMPONENT: Guest Details Form (Step 1) ---
export const GuestDetailsForm = ({
  guestDetails,
  handleGuestInputChange,
  isGuestDetailsSaved,
  handleEditGuestDetails,
  handleSaveGuestDetails,
  isActive,
}) => {
  return (
    <div
      className={cn(
        "transition-all duration-300",
        !isActive && "opacity-60 grayscale pointer-events-none"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center text-xl font-bold text-black">
          <span className="flex items-center justify-center w-8 h-8 mr-3 text-sm text-white rounded-full bg-primary">
            1
          </span>
          Guest Details
        </h3>
        {isGuestDetailsSaved && (
          <Button size="sm" variant="outline" onClick={handleEditGuestDetails}>
            <Pencil className="w-3 h-3 mr-2" /> Edit
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-gray-700">Full Name</Label>
          <Input
            className="font-medium text-black"
            name="name"
            value={guestDetails.name}
            onChange={handleGuestInputChange}
            disabled={isGuestDetailsSaved}
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-700">Phone Number</Label>
          <Input
            className="font-medium text-black"
            name="phone"
            value={guestDetails.phone}
            onChange={handleGuestInputChange}
            disabled={isGuestDetailsSaved}
            placeholder="+94 77 ..."
          />
        </div>
        <div className="col-span-1 space-y-2 md:col-span-2">
          <Label className="text-gray-700">Address</Label>
          <Input
            className="font-medium text-black"
            name="address"
            value={guestDetails.address}
            onChange={handleGuestInputChange}
            disabled={isGuestDetailsSaved}
            placeholder="123 Main St..."
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-700">Email</Label>
          <Input
            className="font-medium text-black"
            name="email"
            value={guestDetails.email}
            onChange={handleGuestInputChange}
            disabled={isGuestDetailsSaved}
            placeholder="john@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-700">ID / Passport Number</Label>
          <Input
            className="font-medium text-black"
            name="idNumber"
            value={guestDetails.idNumber}
            onChange={handleGuestInputChange}
            disabled={isGuestDetailsSaved}
            placeholder="NIC or Passport"
          />
        </div>
      </div>

      {!isGuestDetailsSaved && (
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSaveGuestDetails}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save & Continue
          </Button>
        </div>
      )}
    </div>
  );
};

// --- COMPONENT: Payment Selection (Step 2) ---
export const PaymentSelection = ({
  isActive,
  isGuestDetailsSaved,
  paymentMethod,
  setPaymentMethod,
  handlePayLater,
  handlePaymentSuccess,
  bookingSummary,
  currency,
  convertPrice,
}) => {
  return (
    <div
      className={cn(
        "transition-all duration-300 pt-6 border-t",
        (!isActive || !isGuestDetailsSaved) &&
          "opacity-40 blur-sm pointer-events-none"
      )}
    >
      <div className="flex items-center mb-4">
        <span className="flex items-center justify-center w-8 h-8 mr-3 text-sm text-white rounded-full bg-primary">
          2
        </span>
        <h3 className="text-xl font-bold text-black">Payment Method</h3>
      </div>

      {isGuestDetailsSaved && (
        <div className="space-y-6 animate-in slide-in-from-bottom-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              className={cn(
                "border-2 rounded-xl p-4 cursor-pointer hover:border-primary transition-colors flex flex-col items-center justify-center gap-3 text-center",
                paymentMethod === "later"
                  ? "border-primary bg-primary/5"
                  : "border-muted"
              )}
              onClick={handlePayLater}
            >
              <Wallet className="w-8 h-8 text-gray-600" />
              <div>
                <h4 className="font-bold text-black">Pay Later</h4>
                <p className="text-xs text-muted-foreground">
                  Reserve now, pay at hotel.
                </p>
              </div>
            </div>

            <div
              className={cn(
                "border-2 rounded-xl p-4 cursor-pointer hover:border-primary transition-colors flex flex-col items-center justify-center gap-3 text-center",
                paymentMethod === "now"
                  ? "border-primary bg-primary/5"
                  : "border-muted"
              )}
              onClick={() => setPaymentMethod("now")}
            >
              <CreditCard className="w-8 h-8 text-gray-600" />
              <div>
                <h4 className="font-bold text-black">Pay Now</h4>
                <p className="text-xs text-muted-foreground">
                  Secure payment via Stripe.
                </p>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {paymentMethod === "now" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <Elements stripe={stripePromise}>
                  <StripePaymentForm
                    amount={convertPrice(bookingSummary.finalTotal)}
                    currency={currency}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

// --- COMPONENT: Success Receipt (Step 3) ---
export const SuccessReceipt = ({
  guestDetails,
  bookingSummary,
  paymentMethod,
  currency,
  convertPrice,
  date,
  nights,
  totalGuests,
  handleFinishBooking,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 duration-300 animate-in zoom-in">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-green-100 rounded-full">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">
          Booking Confirmed!
        </h2>
        <p className="text-lg text-gray-500">
          Thank you for your reservation, {guestDetails.name.split(" ")[0]}.
        </p>
      </div>

      <div className="overflow-hidden bg-white border shadow-lg rounded-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <h3 className="font-bold text-gray-700">Reservation Receipt</h3>
          <span className="px-3 py-1 text-xs font-bold text-green-700 uppercase bg-green-100 rounded-full">
            {paymentMethod === "later" ? "Pay at Hotel" : "Paid Online"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <div>
            <h4 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
              Guest Details
            </h4>
            <p className="text-lg font-bold text-gray-800">
              {guestDetails.name}
            </p>
            <p className="text-gray-600">{guestDetails.email}</p>
            <p className="text-gray-600">{guestDetails.phone}</p>
            <p className="mt-1 text-sm text-gray-600">{guestDetails.address}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
              Stay Info
            </h4>
            <p className="text-lg font-bold text-gray-800">{nights} Night(s)</p>
            <p className="text-gray-600">
              {format(date.from, "MMM dd")} - {format(date.to, "MMM dd, yyyy")}
            </p>
            <p className="text-gray-600">{totalGuests} Guest(s)</p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-b bg-gray-50/50">
          <h4 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
            Room Breakdown
          </h4>
          <div className="space-y-3">
            {bookingSummary.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex flex-col">
                  <span className="text-base font-bold text-gray-800">
                    {item.name}
                  </span>
                  <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Qty: {item.qty}
                  </span>
                </div>
                <span className="font-bold text-gray-900">
                  {currency} {convertPrice(item.total)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-600">Total Amount</span>
            <span className="text-2xl font-bold text-primary">
              {currency} {convertPrice(bookingSummary.finalTotal)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          onClick={handleFinishBooking}
          size="lg"
          className="w-full text-white bg-gray-900 md:w-auto hover:bg-black"
        >
          Finish & Go Home
        </Button>
      </div>
    </div>
  );
};
