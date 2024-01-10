BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[PasswordReset] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] VARCHAR(100) NOT NULL,
    [uuid] VARCHAR(255) NOT NULL,
    [expiresAt] DATETIME2 NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [PasswordReset_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PasswordReset_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [PasswordReset_uuid_key] UNIQUE NONCLUSTERED ([uuid])
);

-- CreateTable
CREATE TABLE [dbo].[Company] (
    [id] INT NOT NULL IDENTITY(1,1),
    [uuid] NVARCHAR(1000) NOT NULL,
    [isActive] TINYINT NOT NULL CONSTRAINT [Company_isActive_df] DEFAULT 1,
    [name] VARCHAR(255) NOT NULL,
    [jobTitles] VARCHAR(255),
    [departments] VARCHAR(255),
    [talentSegments] VARCHAR(255),
    [employmentTypes] VARCHAR(255),
    [benefits] VARCHAR(255),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Company_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Company_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Company_uuid_key] UNIQUE NONCLUSTERED ([uuid])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [companyId] INT NOT NULL,
    [uuid] NVARCHAR(1000) NOT NULL,
    [isActive] TINYINT NOT NULL CONSTRAINT [User_isActive_df] DEFAULT 1,
    [isDarkMode] TINYINT NOT NULL CONSTRAINT [User_isDarkMode_df] DEFAULT 0,
    [role] NVARCHAR(1000),
    [avatar] NVARCHAR(1000),
    [lastName] VARCHAR(30) NOT NULL,
    [firstName] VARCHAR(30) NOT NULL,
    [email] VARCHAR(255) NOT NULL,
    [password] VARCHAR(255) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_uuid_key] UNIQUE NONCLUSTERED ([uuid]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Employee] (
    [id] INT NOT NULL IDENTITY(1,1),
    [companyId] INT NOT NULL,
    [reportingToId] INT,
    [uuid] NVARCHAR(1000) NOT NULL,
    [lastName] VARCHAR(30) NOT NULL,
    [firstName] VARCHAR(30) NOT NULL,
    [nickname] VARCHAR(30),
    [suffix] VARCHAR(10) NOT NULL,
    [phoneNumber] VARCHAR(30) NOT NULL,
    [email] VARCHAR(100) NOT NULL,
    [birthday] DATETIME2 NOT NULL,
    [fullName] VARCHAR(100),
    [middleName] VARCHAR(30),
    [isPortalOpen] TINYINT NOT NULL CONSTRAINT [Employee_isPortalOpen_df] DEFAULT 0,
    [password] VARCHAR(255),
    [avatar] NVARCHAR(1000),
    [bloodType] VARCHAR(20),
    [driverLicense] VARCHAR(100),
    [taxId] VARCHAR(100),
    [hiredDate] DATETIME2,
    [lastHiredDate] DATETIME2,
    [isRehired] TINYINT NOT NULL CONSTRAINT [Employee_isRehired_df] DEFAULT 0,
    [isActive] TINYINT NOT NULL CONSTRAINT [Employee_isActive_df] DEFAULT 0,
    [payType] VARCHAR(10),
    [employmentType] VARCHAR(255),
    [employeeCompanyId] NVARCHAR(1000),
    [tenure] NVARCHAR(1000),
    [salary] DECIMAL(10,2) NOT NULL CONSTRAINT [Employee_salary_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Employee_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Employee_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Employee_uuid_key] UNIQUE NONCLUSTERED ([uuid]),
    CONSTRAINT [Employee_phoneNumber_key] UNIQUE NONCLUSTERED ([phoneNumber]),
    CONSTRAINT [Employee_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[BankAccount] (
    [id] INT NOT NULL IDENTITY(1,1),
    [companyId] INT NOT NULL,
    [employeeId] INT,
    [uuid] NVARCHAR(1000) NOT NULL,
    [bankName] VARCHAR(255) NOT NULL,
    [accountNumber] VARCHAR(255) NOT NULL,
    [cardNumber] VARCHAR(255) NOT NULL,
    [accountType] VARCHAR(255) NOT NULL,
    [isActive] TINYINT NOT NULL CONSTRAINT [BankAccount_isActive_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [BankAccount_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [BankAccount_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [BankAccount_uuid_key] UNIQUE NONCLUSTERED ([uuid])
);

-- CreateTable
CREATE TABLE [dbo].[EmploymentHistory] (
    [id] INT NOT NULL IDENTITY(1,1),
    [companyId] INT NOT NULL,
    [employeeId] INT NOT NULL,
    [onBoarding] DATETIME2 NOT NULL,
    [offBoarding] DATETIME2 NOT NULL,
    [reason] VARCHAR(255) NOT NULL,
    [remarks] VARCHAR(255),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [EmploymentHistory_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [EmploymentHistory_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[LeaveRequest] (
    [id] INT NOT NULL IDENTITY(1,1),
    [employeeId] INT NOT NULL,
    [uuid] NVARCHAR(1000) NOT NULL,
    [from] DATETIME2 NOT NULL,
    [to] DATETIME2 NOT NULL,
    [numberOfWorkingDays] INT NOT NULL,
    [resume] DATETIME2 NOT NULL,
    [reasons] NVARCHAR(1000),
    [absenceType] VARCHAR(20) NOT NULL,
    [isPaid] INT NOT NULL,
    [isHrNoted] TINYINT NOT NULL CONSTRAINT [LeaveRequest_isHrNoted_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [LeaveRequest_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [LeaveRequest_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LeaveRequest_uuid_key] UNIQUE NONCLUSTERED ([uuid])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Employee_fullName_idx] ON [dbo].[Employee]([fullName]);

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Employee] ADD CONSTRAINT [Employee_reportingToId_fkey] FOREIGN KEY ([reportingToId]) REFERENCES [dbo].[Employee]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Employee] ADD CONSTRAINT [Employee_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[BankAccount] ADD CONSTRAINT [BankAccount_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[BankAccount] ADD CONSTRAINT [BankAccount_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[Employee]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[EmploymentHistory] ADD CONSTRAINT [EmploymentHistory_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[EmploymentHistory] ADD CONSTRAINT [EmploymentHistory_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[Employee]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LeaveRequest] ADD CONSTRAINT [LeaveRequest_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[Employee]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
