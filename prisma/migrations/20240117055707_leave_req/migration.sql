/*
  Warnings:

  - You are about to drop the column `resume` on the `LeaveRequest` table. All the data in the column will be lost.
  - Added the required column `resumeOn` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LeaveRequest] DROP COLUMN [resume];
ALTER TABLE [dbo].[LeaveRequest] ADD [customRoutingApproval] VARCHAR(255),
[resumeOn] DATETIME2 NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
