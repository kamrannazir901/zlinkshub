import pkg from "@amzn/creatorsapi-nodejs-sdk";
import Link from "../models/Link.js";
import TrackingTag from "../models/TrackingTag.js";

const { ApiClient, DefaultApi, GetItemsRequestContent } = pkg;

export const testAmazonConnection = async (req, res) => {
  try {
    // 1. URL to test (Note: I ensured this is a .com URL for your .com keys)
    const url =
      "https://www.amazon.com/PartyWoo-Balloons-Turquoise-Decorations-Birthday/dp/B0BBGB46HB?psc=1&pd_rd_w=qFMze&content-id=amzn1.sym.ea1d9533-fbb7-4608-bb6f-bfdceb6f6336&pf_rd_p=ea1d9533-fbb7-4608-bb6f-bfdceb6f6336&pf_rd_r=R89DEWAFRRW237ZK29JD&pd_rd_wg=AuaW2&pd_rd_r=3a809664-af66-41d4-95e2-4394b000204e&ref_=sspa_dk_detail_sbt_img_1&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWxfdGhlbWF0aWM=";

    const marketplaceMap = {
      com: "www.amazon.com",
      "co.uk": "www.amazon.co.uk",
      // ... keep your other mappings
    };

    const domainMatch = url.match(/amazon\.([a-z.]{2,6})/i);
    const tld = domainMatch ? domainMatch[1].replace(/\/$/, "") : "com";
    const marketplace = marketplaceMap[tld] || "www.amazon.com";

    const match = url.match(
      /(?:\/dp\/|\/gp\/product\/|\/aw\/d\/|bt7\/)([A-Z0-9]{10})/i,
    );
    const extractedAsin = match ? match[1] : null;

    if (!extractedAsin) {
      return res.status(400).json({ error: "Could not extract ASIN." });
    }

    // 2. Initialize SDK with USA Credentials from your CSV
    const apiClient = new ApiClient();

    // IMPORTANT: The region/host must match the marketplace for some SDK versions
    // apiClient.host = "paapi.us-east-1.amazonaws.com"; // Explicitly set host for USA
    // apiClient.region = "us-east-1";

    apiClient.accessKey = "1fnd8mk4at0llr4u2tp5pemihe"; // accessKey is standard in many PA-API SDKs
    apiClient.secretKey = "5emtfpt1vq8cdj2s1uvm389q8fv1506jlqouqqriepmd81ehj47";

    // If your specific SDK uses credentialId/Secret instead:
    apiClient.credentialId = "1fnd8mk4at0llr4u2tp5pemihe";
    apiClient.credentialSecret =
      "5emtfpt1vq8cdj2s1uvm389q8fv1506jlqouqqriepmd81ehj47";

    apiClient.version = "2.1"; // Use 2.2 as it's the latest stable for Creators

    const api = new DefaultApi(apiClient);

    // 3. Request Content
    const getItemsRequest = new GetItemsRequestContent();
    getItemsRequest.marketplace = marketplace;
    getItemsRequest.partnerTag = "ahmad465-20"; // USA Tag
    getItemsRequest.itemIds = [extractedAsin];
    getItemsRequest.resources = [
      "images.primary.large",
      "itemInfo.title",
      "itemInfo.features",
      "offersV2.listings.price",
      "itemInfo.classifications",
    ];

    const response = await api.getItems(marketplace, getItemsRequest);

    return res.json({
      success: true,
      data: response.itemsResult?.items?.[0] || null,
    });
  } catch (err) {
    // Handle SDK error response
    const errorBody = err.response?.text
      ? JSON.parse(err.response.text)
      : err.message;
    res.status(500).json({ success: false, error: errorBody });
  }
};

export const generateLink = async (req, res) => {
  try {
    const { amazonUrl } = req.body;

    // 1. Marketplace Regional Configuration Map
    const marketplaceConfigs = {
      // --- AMERICAS (Region: us-east-1) ---
      com: {
        host: "paapi.us-east-1.amazonaws.com",
        region: "us-east-1",
        market: "www.amazon.com",
      },
      ca: {
        host: "paapi.us-east-1.amazonaws.com",
        region: "us-east-1",
        market: "www.amazon.ca",
      },
      "com.mx": {
        host: "paapi.us-east-1.amazonaws.com",
        region: "us-east-1",
        market: "www.amazon.com.mx",
      },
      "com.br": {
        host: "paapi.us-east-1.amazonaws.com",
        region: "us-east-1",
        market: "www.amazon.com.br",
      },

      // --- EUROPE, INDIA, MIDDLE EAST (Region: eu-west-1) ---
      "co.uk": {
        host: "paapi.eu-west-1.amazonaws.com",
        region: "eu-west-1",
        market: "www.amazon.co.uk",
      },
      de: {
        host: "paapi.eu-west-1.amazonaws.com",
        region: "eu-west-1",
        market: "www.amazon.de",
      },
      fr: {
        host: "paapi.eu-west-1.amazonaws.com",
        region: "eu-west-1",
        market: "www.amazon.fr",
      },
      es: {
        host: "paapi.eu-west-1.amazonaws.com",
        region: "eu-west-1",
        market: "www.amazon.es",
      },
      it: {
        host: "paapi.eu-west-1.amazonaws.com",
        region: "eu-west-1",
        market: "www.amazon.it",
      },
      nl: {
        host: "paapi.eu-west-1.amazonaws.com",
        region: "eu-west-1",
        market: "www.amazon.nl",
      },
      se: {
        host: "paapi.eu-west-1.amazonaws.com",
        region: "eu-west-1",
        market: "www.amazon.se",
      },
      pl: {
        host: "paapi.eu-west-1.amazonaws.com",
        region: "eu-west-1",
        market: "www.amazon.pl",
      },
      ae: {
        host: "paapi.eu-west-1.amazonaws.com",
        region: "eu-west-1",
        market: "www.amazon.ae",
      },
      sa: {
        host: "paapi.eu-west-1.amazonaws.com",
        region: "eu-west-1",
        market: "www.amazon.sa",
      },
      in: {
        host: "paapi.eu-west-1.amazonaws.com",
        region: "eu-west-1",
        market: "www.amazon.in",
      },

      // --- FAR EAST & AUSTRALIA (Region: us-west-2) ---
      "co.jp": {
        host: "paapi.us-west-2.amazonaws.com",
        region: "us-west-2",
        market: "www.amazon.co.jp",
      },
      sg: {
        host: "paapi.us-west-2.amazonaws.com",
        region: "us-west-2",
        market: "www.amazon.sg",
      },
      "com.au": {
        host: "paapi.us-west-2.amazonaws.com",
        region: "us-west-2",
        market: "www.amazon.com.au",
      },
    };

    // 2. Extract Domain and ASIN
    const domainMatch = amazonUrl.match(/amazon\.([a-z.]{2,6})/i);
    const tld = domainMatch ? domainMatch[1].replace(/\/$/, "") : "com";
    const config = marketplaceConfigs[tld] || marketplaceConfigs["com"];

    const asinMatch = amazonUrl.match(
      /(?:\/dp\/|\/gp\/product\/|\/aw\/d\/|bt7\/)([A-Z0-9]{10})/i,
    );
    const asin = asinMatch ? asinMatch[1] : null;

    if (!asin) return res.status(400).json({ error: "ASIN not found in URL." });

    // 3. Database Lookup: Find Tag and linked API Credentials
    const userTag = await TrackingTag.findOne({
      user: req.user._id,
      marketplace: config.market,
    }).populate("apiAccount");

    if (!userTag || !userTag.apiAccount) {
      return res
        .status(404)
        .json({ error: `No credentials found for ${config.market}` });
    }

    // 4. Initialize SDK with Dynamic Host, Region, and DB Version
    const apiClient = new ApiClient();
    apiClient.host = config.host;
    apiClient.region = config.region;

    apiClient.credentialId = userTag.apiAccount.credentialId;
    apiClient.credentialSecret = userTag.apiAccount.credentialSecret;

    // --- DATABASE DRIVEN VERSION ---
    apiClient.version = userTag.apiAccount.version || "2.1";

    const api = new DefaultApi(apiClient);

    // 5. Build Request
    const getItemsRequest = new GetItemsRequestContent();
    getItemsRequest.marketplace = config.market;
    getItemsRequest.partnerTag = userTag.tag;
    getItemsRequest.itemIds = [asin];
    getItemsRequest.condition = "Any";
    getItemsRequest.resources = [
      "images.primary.large",
      "itemInfo.title",
      "itemInfo.features",
      "offersV2.listings.price",
      "itemInfo.classifications",
    ];

    // --- DEBUG LOGS ---
    console.log(
      `Region: ${config.region} | Version: ${apiClient.version} | Tag: ${userTag.tag}`,
    );

    // 6. Execute Call
    const response = await api.getItems(config.market, getItemsRequest);
    const item = response.itemsResult?.items?.[0];

    if (!item)
      return res.status(404).json({ error: "Product not found on Amazon." });

    // 7. Save to DB and Return

    const listing = item.offersV2?.listings?.[0];

    const priceData = {
      // Use DisplayAmount for the UI
      display: listing?.price?.money?.displayAmount || "Check Price",

      // Use Amount/Currency if you need to do math later
      rawAmount: listing?.price?.money?.amount,
      currency: listing?.price?.money?.currency,

      // Useful for groceries/bulk items
      unitPrice: listing?.price?.pricePerUnit?.displayAmount,
    };

    const newLink = await Link.create({
      userId: req.user._id,
      amazonUrl: amazonUrl,
      affiliateUrl: item.detailPageURL, // Automatic affiliate link
      marketplace: config.market,
      productData: {
        title: item.itemInfo.title.displayValue,
        // Get large image URL safely
        image:
          item.images?.primary?.large?.url || item.images?.primary?.small?.url,
        // Get localized price (e.g., "$19.99" or "£15.00")
        price: priceData.display,
        asin: item.asin,
        // Join the feature bullet points into one string for the description
        description:
          item.itemInfo.features?.displayValues?.join(". ") ||
          "Product details available on Amazon.",
        category:
          item.itemInfo?.classifications?.productGroup?.displayValue ||
          item.itemInfo?.classifications?.binding?.displayValue ||
          "General",
      },
    });

    return res.status(201).json(newLink);
  } catch (err) {
    const errorBody = err.response?.text
      ? JSON.parse(err.response.text)
      : err.message;
    console.error("SDK Error:", errorBody);
    res.status(500).json({ success: false, error: errorBody });
  }
};

export const getUserLinks = async (req, res) => {
  try {
    // If admin, they might want to see all, but usually creators see their own
    const query = req.user.role === "admin" ? {} : { userId: req.user._id };

    const links = await Link.find(query).sort({ createdAt: -1 }).limit(5);
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Ensure the user owns the link or is an admin
    if (
      link.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this link" });
    }

    await link.deleteOne();
    res.json({ message: "Link removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getPublicLink = async (req, res) => {
  try {
    // .lean() makes the query faster for read-only public pages
    const link = await Link.findById(req.params.id).lean();

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "Link not found.",
      });
    }

    // Return the entire document structure
    res.json({
      success: true,
      data: {
        _id: link._id,
        userId: link.userId,
        amazonUrl: link.amazonUrl,
        affiliateUrl: link.affiliateUrl,
        marketplace: link.marketplace,
        productData: {
          title: link.productData?.title,
          image: link.productData?.image,
          price: link.productData?.price,
          asin: link.productData?.asin,
          description: link.productData?.description,
          category: link.productData?.category,
        },
        createdAt: link.createdAt,
      },
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Link ID format" });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllPublicLinks = async (req, res) => {
  try {
    // 1. Get the limit from the query string (e.g., /api/links?limit=8)
    // Default to 8 if no limit is provided
    let limit = parseInt(req.query.limit) || 8;

    // 2. Safety: Ensure limit isn't negative or excessively high
    if (limit <= 0) limit = 8;
    if (limit > 100) limit = 100;

    // 3. Fetch links using the dynamic limit
    const links = await Link.find()
      .select("productData marketplace createdAt")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: links.length, // Helpful for the frontend to know how many were returned
      data: links,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product feed",
      error: error.message,
    });
  }
};
