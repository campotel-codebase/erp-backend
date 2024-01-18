/*
  Warnings:

  - You are about to drop the column `customRoutingApproval` on the `LeaveRequest` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LeaveRequest] DROP COLUMN [customRoutingApproval];
ALTER TABLE [dbo].[LeaveRequest] ADD [isApprovalDefault] TINYINT NOT NULL CONSTRAINT [LeaveRequest_isApprovalDefault_df] DEFAULT 1;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
