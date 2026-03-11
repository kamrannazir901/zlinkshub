import pkg from "@amzn/creatorsapi-nodejs-sdk";
import Link from "../models/Link.js";
import TrackingTag from "../models/TrackingTag.js";

const {
  ApiClient,
  DefaultApi,
  GetItemsRequestContent,
  GetReportRequestContent,
  ListReportsRequestContent,
} = pkg;

export const createReport = async (req, res) => {
  try {
    const apiClient = new ApiClient();
    apiClient.credentialId = "1fnd8mk4at0llr4u2tp5pemihe";
    apiClient.credentialSecret =
      "5emtfpt1vq8cdj2s1uvm389q8fv1506jlqouqqriepmd81ehj47";
    apiClient.version = "2.1";

    const api = new DefaultApi(apiClient);
    console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(api)));
    const createReportRequest = new GetReportRequestContent();
    createReportRequest.reportType = "EARNINGS"; // earnings report type
    createReportRequest.startDate = "2025-01-01"; // adjust dates
    createReportRequest.endDate = "2025-12-31";

    const response = await api.createReport(
      "www.amazon.com",
      createReportRequest,
    );

    // Save the reportId — you need it in Step 2
    res.json({ success: true, reportId: response.reportId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const checkReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;

    const apiClient = new ApiClient();
    apiClient.credentialId = "1fnd8mk4at0llr4u2tp5pemihe";
    apiClient.credentialSecret =
      "5emtfpt1vq8cdj2s1uvm389q8fv1506jlqouqqriepmd81ehj47";
    apiClient.version = "2.1";

    const api = new DefaultApi(apiClient);
    const response = await api.listReports("www.amazon.com");

    // Find your specific report
    const report = response.reports?.find((r) => r.reportId === reportId);

    if (!report) {
      return res.json({ success: false, message: "Report not found" });
    }

    res.json({
      success: true,
      status: report.processingStatus, // IN_QUEUE / IN_PROGRESS / DONE
      reportDocumentId: report.reportDocumentId, // only available when DONE
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getReportData = async (req, res) => {
  try {
    const { reportDocumentId } = req.params;

    const apiClient = new ApiClient();
    apiClient.credentialId = "1fnd8mk4at0llr4u2tp5pemihe";
    apiClient.credentialSecret =
      "5emtfpt1vq8cdj2s1uvm389q8fv1506jlqouqqriepmd81ehj47";
    apiClient.version = "2.1";

    const api = new DefaultApi(apiClient);
    const response = await api.getReport("www.amazon.com", {
      filename: reportDocumentId,
    });

    res.json({ success: true, data: response });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const listReports = async (req, res) => {
  try {
    const apiClient = new ApiClient();
    apiClient.credentialId = "1fnd8mk4at0llr4u2tp5pemihe";
    apiClient.credentialSecret =
      "5emtfpt1vq8cdj2s1uvm389q8fv1506jlqouqqriepmd81ehj47";
    apiClient.version = "2.1";
    const api = new DefaultApi(apiClient);
    const response = await api.listReports("www.amazon.com");
    res.json({ success: true, reports: response.reports });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
