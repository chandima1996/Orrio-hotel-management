import { Shield, Lock, Eye, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Legal = () => {
  return (
    <div className="min-h-screen pt-24 pb-10">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm space-y-10">
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">1. Introduction</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to Orrio. We respect your privacy and are committed to
              protecting your personal data. This privacy policy will inform you
              as to how we look after your personal data when you visit our
              website (regardless of where you visit it from) and tell you about
              your privacy rights and how the law protects you.
            </p>
          </section>

          <Separator />

          {/* Data Collection */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">2. The Data We Collect</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may collect, use, store and transfer different kinds of
              personal data about you which we have grouped together follows:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Identity Data:</strong>{" "}
                includes first name, last name, username or similar identifier.
              </li>
              <li>
                <strong className="text-foreground">Contact Data:</strong>{" "}
                includes billing address, delivery address, email address and
                telephone numbers.
              </li>
              <li>
                <strong className="text-foreground">Financial Data:</strong>{" "}
                includes bank account and payment card details (encrypted).
              </li>
              <li>
                <strong className="text-foreground">Transaction Data:</strong>{" "}
                includes details about payments to and from you and other
                details of products you have purchased from us.
              </li>
            </ul>
          </section>

          <Separator />

          {/* How We Use Data */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">3. How We Use Your Data</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We will only use your personal data when the law allows us to.
              Most commonly, we will use your personal data in the following
              circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                Where we need to perform the contract we are about to enter into
                or have entered into with you.
              </li>
              <li>
                Where it is necessary for our legitimate interests (or those of
                a third party) and your interests and fundamental rights do not
                override those interests.
              </li>
              <li>
                Where we need to comply with a legal or regulatory obligation.
              </li>
            </ul>
          </section>

          <Separator />

          {/* Data Security */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">4. Data Security</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We have put in place appropriate security measures to prevent your
              personal data from being accidentally lost, used or accessed in an
              unauthorized way, altered or disclosed. In addition, we limit
              access to your personal data to those employees, agents,
              contractors and other third parties who have a business need to
              know.
            </p>
          </section>

          {/* Contact for Privacy */}
          <div className="mt-12 p-6 bg-muted/50 rounded-xl border border-border">
            <h3 className="font-bold text-lg mb-2">
              Have questions about your data?
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              If you have any questions about this privacy policy or our privacy
              practices, please contact our data privacy manager.
            </p>
            <a
              href="/contact"
              className="text-primary hover:underline font-medium"
            >
              Contact Support Team &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;
