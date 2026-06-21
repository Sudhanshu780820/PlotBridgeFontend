// controllers/dashboardController.js

const Plot = require("../models/Plot");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total plots
    const totalListings = await Plot.countDocuments({
      seller: userId,
    });

    // Active plots
    const activeListings = await Plot.countDocuments({
      seller: userId,
      status: "Active",
    });

    // Sold plots
    const soldProperties = await Plot.countDocuments({
      seller: userId,
      status: "Sold",
    });

    // Get all seller plots for views calculation
    const plots = await Plot.find(
      { seller: userId },
      "views"
    );

    const totalViews = plots.reduce(
      (sum, plot) => sum + (plot.views || 0),
      0
    );

    res.status(200).json({
      totalListings,
      activeListings,
      soldProperties,
      totalViews,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    res.status(500).json({
      message: "Error fetching dashboard stats",
    });
  }
};

const getMylistings = async (req, res) => {
  try {
    const userId = req.user.id;

    const listings = await Plot.find({
      seller: userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      listings,
    });
  } catch (error) {
    console.error("My Listings Error:", error);

    res.status(500).json({
      message: "Error fetching your listings",
    });
  }
};

module.exports = {
  getDashboardStats,
  getMylistings,
};