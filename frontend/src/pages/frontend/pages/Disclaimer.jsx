import React from "react";

const Disclaimer = () => {
  return (
    <div className="min-h-screen Affilics py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-black mb-6 text-center">
          Disclaimer
        </h1>

        {/* Introduction */}
        <p className="text-gray mb-6">
          Affilvio is an Amazon affiliate platform. This disclaimer explains the
          terms and conditions under which our content is provided. By using
          this website, you agree to the following:
        </p>

        {/* Section 1 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black mb-2">
            Affiliate Links
          </h2>
          <p className="text-gray">
            Some of the links on this website are affiliate links. This means
            that if you click on a link and make a purchase, we may earn a small
            commission at no extra cost to you. All products are sold at the
            same price as on Amazon.
          </p>
        </div>

        {/* Section 2 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black mb-2">
            Accuracy of Information
          </h2>
          <p className="text-gray">
            We strive to provide accurate and up-to-date information about
            products. However, we do not guarantee the accuracy, completeness,
            or reliability of any product descriptions, prices, or other
            information provided on this site.
          </p>
        </div>

        {/* Section 3 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black mb-2">
            No Professional Advice
          </h2>
          <p className="text-gray">
            The content on this website is for informational purposes only. It
            does not constitute professional advice, and you should not rely on
            it for making purchasing or financial decisions.
          </p>
        </div>

        {/* Section 4 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black mb-2">
            Limitation of Liability
          </h2>
          <p className="text-gray">
            Affilvio will not be held liable for any damages, losses, or
            inconveniences resulting from the use of this website or products
            purchased through affiliate links. All users use this website at
            their own risk.
          </p>
        </div>

        {/* Section 5 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black mb-2">
            External Links
          </h2>
          <p className="text-gray">
            This website may contain links to other websites. We are not
            responsible for the content, privacy policies, or practices of
            third-party websites.
          </p>
        </div>

        {/* Conclusion */}
        <div className="mt-6">
          <p className="text-gray">
            By using this website, you acknowledge and agree to this disclaimer.
            If you do not agree, please refrain from using Affilvio.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
