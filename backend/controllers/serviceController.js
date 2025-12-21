import ServiceModel from "../models/serviceModel.js";


export const CreateService = async (req, res) => {
    try {
        const { serviceTitle, packages } = req.body;

        if (!serviceTitle) {
            return res.status(400).json({
                message: "serviceTitle is required",
                success: false
            })
        }

        // Handle uploaded serviceIcon file
        let serviceIcon = null;
        if (req.files) {
            // Support multiple possible field names: serviceIcon, icon, service_icon
            const getFilePath = (names) => {
                if (!req.files) return undefined;
                if (Array.isArray(req.files)) {
                    const f = req.files.find((file) => names.includes(file.fieldname));
                    return f ? f.path.replace(/\\/g, "/") : undefined;
                }
                for (const n of names) {
                    if (req.files[n] && req.files[n][0]) return req.files[n][0].path.replace(/\\/g, "/");
                }
                return undefined;
            };

            const iconFile = getFilePath(["serviceIcon", "icon", "service_icon"]);
            if (iconFile) {
                serviceIcon = iconFile;
            }
        }

        if (!serviceIcon) {
            return res.status(400).json({
                message: "serviceIcon image is required",
                success: false
            })
        }

        // Parse packages if sent as JSON string (form-data sends it as string)
        let packagesData = packages;
        if (!packages) {
            return res.status(400).json({
                message: "packages is required",
                success: false
            })
        }

        // Parse JSON string if packages is a string (from form-data)
        // Priority: Try parsing as array first (Option 1 - recommended)
        if (typeof packages === "string") {
            try {
                let jsonString = packages.trim();
                
                // First, try parsing directly as array (Option 1 - most common case)
                try {
                    packagesData = JSON.parse(jsonString);
                    // Verify it's actually an array
                    if (!Array.isArray(packagesData)) {
                        throw new Error("Parsed value is not an array");
                    }
                } catch (arrayError) {
                    // If direct array parsing fails, try other formats
                    
                    // Handle double-encoded JSON (string wrapped in quotes)
                    if (jsonString.startsWith('"') && jsonString.endsWith('"')) {
                        try {
                            jsonString = jsonString.slice(1, -1);
                            // Unescape quotes and backslashes
                            jsonString = jsonString.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                            packagesData = JSON.parse(jsonString);
                            if (!Array.isArray(packagesData)) {
                                throw new Error("Parsed value is not an array");
                            }
                        } catch (quoteError) {
                            // If that also fails, try handling object format
                            throw arrayError; // Fall through to object handling
                        }
                    } else if (jsonString.includes('"packages"') || jsonString.includes("'packages'") || /^packages\s*:/.test(jsonString)) {
                        // Handle case where user sends "packages":[{...}] or packages: [{...}] format
                        // First, try extracting array after colon (handles both "packages": and packages: formats)
                        const colonIndex = jsonString.indexOf(':');
                        if (colonIndex !== -1) {
                            let extractedString = jsonString.substring(colonIndex + 1).trim();
                            
                            // Find the actual JSON array by looking for the first '[' and matching ']'
                            // This handles cases where there might be extra text or formatting
                            const firstBracket = extractedString.indexOf('[');
                            if (firstBracket !== -1) {
                                let bracketCount = 0;
                                let lastBracket = firstBracket;
                                
                                // Find the matching closing bracket
                                for (let i = firstBracket; i < extractedString.length; i++) {
                                    if (extractedString[i] === '[') {
                                        bracketCount++;
                                    } else if (extractedString[i] === ']') {
                                        bracketCount--;
                                        if (bracketCount === 0) {
                                            lastBracket = i;
                                            break;
                                        }
                                    }
                                }
                                
                                // Extract just the array portion
                                extractedString = extractedString.substring(firstBracket, lastBracket + 1);
                            } else {
                                // No bracket found, try removing trailing characters (but not closing bracket)
                                extractedString = extractedString.replace(/[,;}]+\s*$/, '');
                            }
                            
                            try {
                                packagesData = JSON.parse(extractedString);
                                if (!Array.isArray(packagesData)) {
                                    throw new Error("Extracted value is not an array");
                                }
                            } catch (extractError) {
                                // If extraction failed, try wrapping in braces to make it a valid JSON object
                                if (!jsonString.startsWith('{')) {
                                    jsonString = '{' + jsonString + '}';
                                }
                                try {
                                    const parsedObj = JSON.parse(jsonString);
                                    if (parsedObj.packages && Array.isArray(parsedObj.packages)) {
                                        packagesData = parsedObj.packages;
                                    } else {
                                        throw new Error("No 'packages' array found in object");
                                    }
                                } catch (objError) {
                                    throw extractError;
                                }
                            }
                        } else {
                            // No colon found, try wrapping in braces
                            if (!jsonString.startsWith('{')) {
                                jsonString = '{' + jsonString + '}';
                            }
                            try {
                                const parsedObj = JSON.parse(jsonString);
                                if (parsedObj.packages && Array.isArray(parsedObj.packages)) {
                                    packagesData = parsedObj.packages;
                                } else {
                                    throw new Error("No 'packages' array found in object");
                                }
                            } catch (objError) {
                                throw arrayError;
                            }
                        }
                    } else {
                        throw arrayError;
                    }
                }
            } catch (e) {
                console.error("JSON Parse Error:", e.message);
                console.error("Packages string received:", packages);
                return res.status(400).json({
                    message: `Invalid packages JSON format: ${e.message}`,
                    success: false,
                    hint: "Send just the array: [{\"packageTitle\":\"Name\",\"price\":20,\"features\":[\"feature1\"]}]",
                    received: packages.substring(0, 200) // Show first 200 chars for debugging
                })
            }
        } else if (Array.isArray(packages)) {
            // If it's already an array, use it directly
            packagesData = packages;
        } else if (typeof packages === "object" && packages !== null) {
            // If it's an object, try to extract the packages array
            if (packages.packages && Array.isArray(packages.packages)) {
                packagesData = packages.packages;
            } else if (Array.isArray(packages)) {
                packagesData = packages;
            }
        }

        // Validate that packages is an array after parsing
        if (!Array.isArray(packagesData) || packagesData.length === 0) {
            return res.status(400).json({
                message: "packages must be a non-empty array",
                success: false
            })
        }

        // Validate each package structure
        for (let i = 0; i < packagesData.length; i++) {
            const pkg = packagesData[i];
            if (!pkg.packageTitle) {
                return res.status(400).json({
                    message: `Package at index ${i} is missing required field: packageTitle`,
                    success: false
                })
            }
            if (pkg.price === undefined || pkg.price === null) {
                return res.status(400).json({
                    message: `Package at index ${i} is missing required field: price`,
                    success: false
                })
            }
            if (!pkg.features || !Array.isArray(pkg.features) || pkg.features.length === 0) {
                return res.status(400).json({
                    message: `Package at index ${i} must have at least one feature`,
                    success: false
                })
            }
        }

        const newService = await ServiceModel.create({
            serviceTitle,
            serviceIcon,
            packages: packagesData
        })

        res.status(201).json({
            message: "Service created successfully",
            success: true,
            data: newService
        })
    } catch (error) {
        console.error("Create Service Error:", error);
        
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message).join(', ');
            return res.status(400).json({
                success: false,
                message: `Validation error: ${errors}`,
                error: error.message
            })
        }

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        })
    }
}


export const getALlServices = async (req, res) => {
    try {
        const services = await ServiceModel.find().sort({ createdAt: -1 });

        // Return 200 OK with empty array if no services found (not 404)
        res.status(200).json({
            message: services.length === 0 ? "No services found" : "All Services",
            success: true,
            data: services,
            count: services.length
        })
    } catch (error) {
        console.error("Get All Services Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        })
    }
}

export const getServicesById = async (req, res) => {
    try {
        const { _id } = req.params;
        const service = await ServiceModel.findById(_id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found with this id"
            })
        }

        res.status(200).json({
            success: true,
            message: `Service retrieved successfully`,
            data: service
        })
    } catch (error) {
        console.error("Get Service By ID Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }

}


export const updateServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceTitle, packages } = req.body;

    // Build update object
    const update = {};

    if (serviceTitle !== undefined) {
      update.serviceTitle = serviceTitle;
    }

    // Handle uploaded serviceIcon file
    if (req.files) {
      const getFilePath = (names) => {
        if (!req.files) return undefined;
        if (Array.isArray(req.files)) {
          const f = req.files.find((file) => names.includes(file.fieldname));
          return f ? f.path.replace(/\\/g, "/") : undefined;
        }
        for (const n of names) {
          if (req.files[n] && req.files[n][0]) return req.files[n][0].path.replace(/\\/g, "/");
        }
        return undefined;
      };

      const iconFile = getFilePath(["serviceIcon", "icon", "service_icon"]);
      if (iconFile) {
        update.serviceIcon = iconFile;
      }
    }

    // Handle packages update
    if (packages !== undefined) {
      let packagesData = packages;

      // Parse JSON string if packages is a string
      if (typeof packages === "string") {
        try {
          let jsonString = packages.trim();
          
          // Try parsing directly as array first
          try {
            packagesData = JSON.parse(jsonString);
            if (!Array.isArray(packagesData)) {
              throw new Error("Parsed value is not an array");
            }
          } catch (arrayError) {
            // Handle double-encoded JSON (string wrapped in quotes)
            if (jsonString.startsWith('"') && jsonString.endsWith('"')) {
              try {
                jsonString = jsonString.slice(1, -1);
                // Unescape quotes and backslashes
                jsonString = jsonString.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                packagesData = JSON.parse(jsonString);
                if (!Array.isArray(packagesData)) {
                  throw new Error("Parsed value is not an array");
                }
              } catch (quoteError) {
                // If that also fails, try handling object format
                throw arrayError; // Fall through to object handling
              }
            } else if (jsonString.includes('"packages"') || jsonString.includes("'packages'") || /^packages\s*:/.test(jsonString)) {
              // Handle case where user sends "packages":[{...}] or packages: [{...}] format
              // First, try extracting array after colon (handles both "packages": and packages: formats)
              const colonIndex = jsonString.indexOf(':');
              if (colonIndex !== -1) {
                let extractedString = jsonString.substring(colonIndex + 1).trim();
                
                // Find the actual JSON array by looking for the first '[' and matching ']'
                // This handles cases where there might be extra text or formatting
                const firstBracket = extractedString.indexOf('[');
                if (firstBracket !== -1) {
                  let bracketCount = 0;
                  let lastBracket = firstBracket;
                  
                  // Find the matching closing bracket
                  for (let i = firstBracket; i < extractedString.length; i++) {
                    if (extractedString[i] === '[') {
                      bracketCount++;
                    } else if (extractedString[i] === ']') {
                      bracketCount--;
                      if (bracketCount === 0) {
                        lastBracket = i;
                        break;
                      }
                    }
                  }
                  
                  // Extract just the array portion
                  extractedString = extractedString.substring(firstBracket, lastBracket + 1);
                } else {
                  // No bracket found, try removing trailing characters (but not closing bracket)
                  extractedString = extractedString.replace(/[,;}]+\s*$/, '');
                }
                
                try {
                  packagesData = JSON.parse(extractedString);
                  if (!Array.isArray(packagesData)) {
                    throw new Error("Extracted value is not an array");
                  }
                } catch (extractError) {
                  // If extraction failed, try wrapping in braces to make it a valid JSON object
                  if (!jsonString.startsWith('{')) {
                    jsonString = '{' + jsonString + '}';
                  }
                  try {
                    const parsedObj = JSON.parse(jsonString);
                    if (parsedObj.packages && Array.isArray(parsedObj.packages)) {
                      packagesData = parsedObj.packages;
                    } else {
                      throw new Error("No 'packages' array found in object");
                    }
                  } catch (objError) {
                    throw extractError;
                  }
                }
              } else {
                // No colon found, try wrapping in braces
                if (!jsonString.startsWith('{')) {
                  jsonString = '{' + jsonString + '}';
                }
                try {
                  const parsedObj = JSON.parse(jsonString);
                  if (parsedObj.packages && Array.isArray(parsedObj.packages)) {
                    packagesData = parsedObj.packages;
                  } else {
                    throw new Error("No 'packages' array found in object");
                  }
                } catch (objError) {
                  throw arrayError;
                }
              }
            } else {
              throw arrayError;
            }
          }
        } catch (e) {
          return res.status(400).json({
            success: false,
            message: `Invalid packages JSON format: ${e.message}`,
            hint: "Send just the array: [{\"packageTitle\":\"Name\",\"price\":20,\"features\":[\"feature1\"]}]",
            received: packages.substring(0, 200)
          });
        }
      }

      // Validate packages array
      if (!Array.isArray(packagesData) || packagesData.length === 0) {
        return res.status(400).json({
          success: false,
          message: "packages must be a non-empty array"
        });
      }

      // Validate each package structure
      for (let i = 0; i < packagesData.length; i++) {
        const pkg = packagesData[i];
        if (!pkg.packageTitle) {
          return res.status(400).json({
            success: false,
            message: `Package at index ${i} is missing required field: packageTitle`
          });
        }
        if (pkg.price === undefined || pkg.price === null) {
          return res.status(400).json({
            success: false,
            message: `Package at index ${i} is missing required field: price`
          });
        }
        if (!pkg.features || !Array.isArray(pkg.features) || pkg.features.length === 0) {
          return res.status(400).json({
            success: false,
            message: `Package at index ${i} must have at least one feature`
          });
        }
      }

      update.packages = packagesData;
    }

    // If no fields provided to update, return 400
    if (Object.keys(update).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No updatable fields provided"
      });
    }

    const updatedService = await ServiceModel.findByIdAndUpdate(id, update, { new: true, runValidators: true });

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService
    });

  } catch (error) {
    console.error("Update Service Error:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({
        success: false,
        message: `Validation error: ${errors}`,
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const deleteServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await ServiceModel.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    res.status(200).json({
      success: true,
      message: `Service deleted successfully`,
      data: service
    });

  } catch (error) {
    console.error("Delete Service By ID Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};