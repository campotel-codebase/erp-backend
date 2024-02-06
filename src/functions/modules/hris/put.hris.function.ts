import prisma from "../../../../libs/prisma";
import {unlink} from "fs/promises";
import {selectedEmployeeType} from "../../../../types/modules/hris/selected-employee";

export const updateEmployeeAvatar = async (
	imgSrc: string,
	selectedEmployee: selectedEmployeeType,
) => {
	if (selectedEmployee.avatar) {
		const currentAvatarFileName = selectedEmployee.avatar.split("/").pop();
		const currentAvatarPath = `public/avatar/${currentAvatarFileName}`;
		await unlink(currentAvatarPath);
	}
	const newAvatar = await prisma.employee.update({
		where: {uuid: selectedEmployee.uuid},
		data: {avatar: imgSrc},
		select: {avatar: true},
	});
	return {status: 200, data: newAvatar.avatar};
};
