import { Router } from "express";
import {
  loginAdmin,
  fetchGuests,
  updateStatus,
  updateHostStatus,
  fetchHosts,
  fetchRequests,
  requestDetails,
  approveRequest,
  rejectRequest,
  getLineChartData,
  getBarChartData,
  getPieChartData,
  fetchGuestData

} from "../controllers/adminController";
import {verifyToken} from '../../middlewares/verifyToken';

const adminRoute = Router();

adminRoute.post("/loginAdmin", loginAdmin);
adminRoute.get("/fetchGuests",verifyToken, fetchGuests);
adminRoute.get("/fetchHosts", verifyToken,fetchHosts);
adminRoute.patch("/updateStatus/:id",verifyToken, updateStatus);
adminRoute.patch("/updateHostStatus/:id",verifyToken, updateHostStatus);
adminRoute.get("/fetchRequests",verifyToken, fetchRequests);
adminRoute.get("/requestDetails/:id",verifyToken, requestDetails);
adminRoute.get("/approveRequest/:id",verifyToken, approveRequest);
adminRoute.get("/rejectRequest/:id",verifyToken, rejectRequest);
adminRoute.get("/getLineChartData",verifyToken, getLineChartData);
adminRoute.get("/getBarChartData",verifyToken, getBarChartData);
adminRoute.get("/getPieChartData",verifyToken, getPieChartData);
adminRoute.get("/fetchGuestData/:id",verifyToken, fetchGuestData);

export default adminRoute;




