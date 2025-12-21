import ServiceModel from "../models/serviceModel.js";


export const CreateService = async (req, res) => {
    try {
        const { serviceTitle, packages } = req.body;
        if (!serviceTitle) {
            res.status(400).json({
                messgae: "serviceTitle is required",
                succses: false
            })
        }

        if (!packages || !Array.isArray(packages) || packages.length == 0) {
            res.status(400).json({
                message: "packages must be a non-empty arra",
                succsess: false,
            })
        }

        const newService = await ServiceModel.create({
            serviceTitle, packages
        })

        res.status(201).json({
            message: "Service created successfully",
            succses: true,
            data: newService
        })
    } catch (error) {
        console.error("Create Service Error:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}


export const getALlServices = async (req, res) => {
    try {
        const services = await ServiceModel.find().sort({ createdAt: -1 });

        if (!services) {
            res.status(400).json({
                message: "Not have services"
            })
        }

        res.status(200).json({
            message: "All Services",
            succses: true,
            data: services
        })
    } catch (error) {

    }
}

export const getServicesById = async (req, res) => {
    try {
        const { _id } = req.params;
        const services = await ServiceModel.findById(_id);
        if (!services) {
            res.status(400).json({
                succses: false,
                message: "Not service have this id"
            })
        }

        res.status(200).json({
            succses: true,
            messgae: `get this is:${_id}`,
            data: services
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