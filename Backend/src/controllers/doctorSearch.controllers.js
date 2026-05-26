import { Doctor } from "../models/doctor.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Advanced search and facet filtering engine for clinical doctor profiles.
 */
export const searchDoctors = asyncHandler(async (req, res) => {
  const {
    query,
    specialization,
    city,
    minExperience,
    maxFee,
    minRating,
    isAcceptingNew,
  } = req.query;

  const pipeline = [];

  // Match active, verified, and visible doctors by default
  const matchStage = {
    isVisible: true,
  };

  if (isAcceptingNew === "true") {
    matchStage.isAcceptingNewPatients = true;
  }

  // Filter by Specialization
  if (specialization) {
    matchStage.specialization = { $regex: new RegExp(specialization, "i") };
  }

  // Filter by City
  if (city) {
    matchStage["clinicAddress.city"] = { $regex: new RegExp(city, "i") };
  }

  // Filter by Rating
  if (minRating) {
    matchStage.rating = { $gte: parseFloat(minRating) };
  }

  pipeline.push({ $match: matchStage });

  // Lookup user profile details for Doctor name and profileImage
  pipeline.push({
    $lookup: {
      from: "users", // Mongoose matches collection names to plural form
      localField: "doctorId",
      foreignField: "_id",
      as: "userProfile",
    },
  });

  // Unwind the profile array
  pipeline.push({
    $unwind: {
      path: "$userProfile",
      preserveNullAndEmptyArrays: false, // Must have a user profile
    },
  });

  // Filter by Generic text Query (Specialization, Bio, Clinic, or Name)
  if (query) {
    pipeline.push({
      $match: {
        $or: [
          { "userProfile.fullname": { $regex: new RegExp(query, "i") } },
          { specialization: { $regex: new RegExp(query, "i") } },
          { clinicName: { $regex: new RegExp(query, "i") } },
          { bio: { $regex: new RegExp(query, "i") } },
        ],
      },
    });
  }

  // Experience and Consultation fee require parsing string/numeric schemas
  const results = await Doctor.aggregate(pipeline);

  // Post-process filters for strings representing numbers (e.g. experience, consultationFee)
  let filteredResults = results;

  if (minExperience) {
    const minExpNum = parseInt(minExperience, 10);
    filteredResults = filteredResults.filter((doc) => {
      const docExp = parseInt(doc.experience, 10) || 0;
      return docExp >= minExpNum;
    });
  }

  if (maxFee) {
    const maxFeeNum = parseInt(maxFee, 10);
    filteredResults = filteredResults.filter((doc) => {
      const docFee = parseInt(doc.consultationFee, 10) || 0;
      return docFee <= maxFeeNum;
    });
  }

  // Map to format fields nicely
  const formattedResults = filteredResults.map((doc) => {
    return {
      _id: doc._id,
      doctor: doc.doctor || doc.userProfile?.fullname,
      specialization: doc.specialization,
      experience: doc.experience,
      consultationFee: doc.consultationFee,
      rating: doc.rating,
      reviewCount: doc.reviewCount,
      bio: doc.bio,
      clinicName: doc.clinicName,
      clinicAddress: doc.clinicAddress,
      isAcceptingNewPatients: doc.isAcceptingNewPatients,
      profileImage: doc.userProfile?.profileImage || "",
      email: doc.userProfile?.email || "",
      phone: doc.userProfile?.phone || "",
    };
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        formattedResults,
        "Doctor catalog filtered and fetched successfully."
      )
    );
});
