import prisma from "../../../libs/prisma";
import {employeeSignInType} from "../../../types/modules/hris/employees";
import {
	verifyHashedPassword,
	verifyResetUuidForPwd,
	sendResetLinkForPwd,
} from "../../utils/password.util";

export const employeeSignIn = async () => {};
export const employeePwdResetLink = async () => {};
export const employeeResetPwd = async () => {};
