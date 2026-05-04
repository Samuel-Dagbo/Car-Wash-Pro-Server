const Service = require("../models/Service");
const AppError = require("../utils/AppError");

const createService = async (data) => {
    const newService = await Service.create(data);
    return newService;
};

const getAllServices = async () => {
    const service = await Service.find()
        .select("-imageData -imageMimeType");
    return service;
};

const getServiceById = async (id) => {
    const service = await Service.findById(id)
        .select("-imageData -imageMimeType");

    if (!service) {
        throw new AppError("Service not found", 404);
    }

    return service;
};
const updateService = async (id,data) => {
    const updatedService = await Service.findByIdAndUpdate(id,data, {new: true});
    if(!updatedService){
        throw new AppError("Service not found", 404);
    }
    return updatedService;
};
const deleteService = async (id) => {
    const deletedService = await Service.findByIdAndDelete(id);
    if(!deletedService){
        throw new AppError("Service not found", 404);
    }
    return deletedService;
};

const deactivateService = async (id) => {
    const service = await Service.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    );

    if (!service) {
        throw new AppError("Service not found", 404);
    }

    return service;
};

const activateService = async (id) => {
    const service = await Service.findByIdAndUpdate(
        id,
        { isActive: true },
        { new: true }
    );

    if (!service) {
        throw new AppError("Service not found", 404);
    }

    return service;
};
    

module.exports = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
    deactivateService,
    activateService
};