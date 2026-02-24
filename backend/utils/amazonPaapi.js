// Import the entry point of the SDK
const ProductAdvertisingAPIv1 = require("../sdk/src/index");
const AffiliateAPIAccount = require("../models/AffiliateAPIAccount");

/**
 * Fetches product data using keys from the Database
 */
const getAmazonProduct = async (amazonUrl) => {
  // 1. Extract ASIN
  const asinMatch = amazonUrl.match("/(?:dp|gp/product)/([a-zA-Z0-9]{10})");
  const asin = asinMatch ? asinMatch[1] : null;
  if (!asin) throw new Error("Could not find a valid ASIN in the URL");

  // 2. Get Active Keys from DB
  const apiAccount = await AffiliateAPIAccount.findOne({ status: "active" });
  if (!apiAccount) throw new Error("No active Amazon API credentials found");

  // 3. Configure the Client dynamically
  const defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;
  defaultClient.accessKey = apiAccount.credentialId;
  defaultClient.secretKey = apiAccount.secret;

  // Set host/region based on your DB baseUrl (e.g. webservices.amazon.com)
  const url = new URL(apiAccount.baseUrl);
  defaultClient.host = `webservices.${url.hostname.replace("www.", "")}`;
  defaultClient.region = "us-east-1"; // Adjust based on your target market

  const api = new ProductAdvertisingAPIv1.DefaultApi();

  // 4. Setup the Request
  const getItemsRequest = new ProductAdvertisingAPIv1.GetItemsRequest();
  getItemsRequest["PartnerTag"] = apiAccount.appName; // Using appName as the tag
  getItemsRequest["PartnerType"] = "Associates";
  getItemsRequest["ItemIds"] = [asin];
  getItemsRequest["Resources"] = [
    "Images.Primary.Large",
    "ItemInfo.Title",
    "ItemInfo.Features",
    "OffersV2.Listings.Price",
  ];

  // 5. Execute
  return new Promise((resolve, reject) => {
    api.getItems(getItemsRequest, (error, data) => {
      if (error) {
        reject(error);
      } else {
        const item = data.ItemsResult.Items[0];
        resolve({
          title: item.ItemInfo.Title.DisplayValue,
          image: item.Images.Primary.Large.URL,
          price: item.OffersV2.Listings[0].Price.Money.DisplayAmount,
          asin: item.ASIN,
          // Get a few lines of description
          description: item.ItemInfo.Features.DisplayValues.slice(0, 3).join(
            ". ",
          ),
        });
      }
    });
  });
};

module.exports = { getAmazonProduct };
