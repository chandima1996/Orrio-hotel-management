import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Import step components
import {
  WizardSidebar,
  GuestDetailsForm,
  PaymentSelection,
  SuccessReceipt,
} from "./BookingWizardSteps";

const BookingWizard = ({
  isWizardOpen,
  closeWizard,
  hotel,
  wizardStep,
  bookingSummary,
  guestDetails,
  handleGuestInputChange,
  handleSaveGuestDetails,
  handleEditGuestDetails,
  isGuestDetailsSaved,
  paymentMethod,
  setPaymentMethod,
  handlePayLater,
  handlePaymentSuccess,
  handleFinishBooking,
  currency,
  convertPrice,
  date,
  nights,
  totalGuests,
}) => {
  return (
    <AnimatePresence>
      {isWizardOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-5xl overflow-hidden bg-white shadow-2xl rounded-2xl max-h-[90vh] flex flex-col md:flex-row"
          >
            {/* --- SIDEBAR (Only visible in steps 1 & 2) --- */}
            {wizardStep !== 3 && (
              <WizardSidebar
                hotel={hotel}
                bookingSummary={bookingSummary}
                currency={currency}
                convertPrice={convertPrice}
                closeWizard={closeWizard}
              />
            )}

            {/* --- MAIN CONTENT --- */}
            <div
              className={cn(
                "flex-1 overflow-y-auto p-6 md:p-8",
                wizardStep === 3 && "w-full bg-slate-50"
              )}
            >
              {wizardStep === 3 ? (
                // --- STEP 3: SUCCESS ---
                <SuccessReceipt
                  guestDetails={guestDetails}
                  bookingSummary={bookingSummary}
                  paymentMethod={paymentMethod}
                  currency={currency}
                  convertPrice={convertPrice}
                  date={date}
                  nights={nights}
                  totalGuests={totalGuests}
                  handleFinishBooking={handleFinishBooking}
                />
              ) : (
                // --- STEPS 1 & 2 ---
                <div className="space-y-8">
                  {/* STEP 1: GUEST FORM */}
                  <GuestDetailsForm
                    guestDetails={guestDetails}
                    handleGuestInputChange={handleGuestInputChange}
                    isGuestDetailsSaved={isGuestDetailsSaved}
                    handleEditGuestDetails={handleEditGuestDetails}
                    handleSaveGuestDetails={handleSaveGuestDetails}
                    isActive={wizardStep >= 1}
                  />

                  {/* STEP 2: PAYMENT */}
                  <PaymentSelection
                    isActive={wizardStep >= 2}
                    isGuestDetailsSaved={isGuestDetailsSaved}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    handlePayLater={handlePayLater}
                    handlePaymentSuccess={handlePaymentSuccess}
                    bookingSummary={bookingSummary}
                    currency={currency}
                    convertPrice={convertPrice}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingWizard;
