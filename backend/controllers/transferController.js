import {
  initiateTransfer,
  listPendingTransfersForBuyer,
  acceptTransfer,
  rejectTransfer
} from "../services/transferService.js";
import { sendSuccess } from "../utils/response.js";

const initiateTransferHandler = async (req, res, next) => {
  try {
    const transfer = await initiateTransfer(req.body);
    sendSuccess(res, 201, transfer);
  } catch (error) {
    next(error);
  }
};

const listTransfersHandler = async (req, res, next) => {
  try {
    const { buyerIdentifier } = req.query;
    if (!buyerIdentifier) {
      return sendSuccess(res, 200, []);
    }
    const transfers = await listPendingTransfersForBuyer(buyerIdentifier);
    sendSuccess(res, 200, transfers);
  } catch (error) {
    next(error);
  }
};

const acceptTransferHandler = async (req, res, next) => {
  try {
    const transfer = await acceptTransfer(req.params.id);
    sendSuccess(res, 200, transfer);
  } catch (error) {
    next(error);
  }
};

const rejectTransferHandler = async (req, res, next) => {
  try {
    const transfer = await rejectTransfer(req.params.id);
    sendSuccess(res, 200, transfer);
  } catch (error) {
    next(error);
  }
};

export {
  initiateTransferHandler,
  listTransfersHandler,
  acceptTransferHandler,
  rejectTransferHandler
};
