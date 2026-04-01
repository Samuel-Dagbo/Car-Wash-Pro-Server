const asyncHandler = require("../utils/asyncHandler");
const {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
    deactivateService,
    activateService
} = require("../services/serviceService");

const createServiceHandler = asyncHandler(async(req,res) => {
    const service = await createService(req.body);
    res.status(201).json(service);
});

const getAllServicesHandler = asyncHandler(async(req,res) => {
    const services = await getAllServices();
    res.status(200).json({
        status: "success",
        result: services.length,
        data:services
    });
});

const getServiceByIdHandler = asyncHandler(async(req,res) => {
    const id = req.params.id;
    const service = await getServiceById(id);
    res.status(200).json({
        status: "success",
        data: service
    });
});

const updateServiceHandler = asyncHandler(async(req,res) => {
     const id = req.params.id;
     const updatedService = await updateService(id, req.body);
     res.status(200).json({
        status: "success",
        data: updatedService
    })
});

const deleteServiceHandler = asyncHandler(async(req,res) => {
    const id = req.params.id;
    await deleteService(id);
    res.status(204).send();
});

const deactivateServiceHandler = asyncHandler(async(req,res) => {
    const id = req.params.id;
    const service = await deactivateService(id);
    res.status(200).json({
        status: "success",
        data: service
    });
});

const activateServiceHandler = asyncHandler(async(req,res) => {
    const id = req.params.id;
    const service = await activateService(id);
    res.status(200).json({
        status: "success",
        data: service
    });
});


module.exports = {
    createServiceHandler,
    getAllServicesHandler,
    getServiceByIdHandler,
    updateServiceHandler,
    deleteServiceHandler,
    deactivateServiceHandler,
    activateServiceHandler
}