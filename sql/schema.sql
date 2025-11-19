-- Core security tables
IF OBJECT_ID('dbo.user_roles', 'U') IS NOT NULL DROP TABLE dbo.user_roles;
IF OBJECT_ID('dbo.roles', 'U') IS NOT NULL DROP TABLE dbo.roles;
IF OBJECT_ID('dbo.users', 'U') IS NOT NULL DROP TABLE dbo.users;

CREATE TABLE dbo.users (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE dbo.roles (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    name NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(255)
);

CREATE TABLE dbo.user_roles (
    user_id UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.users(id),
    role_id UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.roles(id),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE dbo.sessions (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    user_id UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.users(id),
    jwt_token NVARCHAR(500) NOT NULL,
    issued_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    expires_at DATETIME2 NOT NULL
);

CREATE TABLE dbo.login_history (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.users(id),
    login_time DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    ip_address NVARCHAR(50),
    user_agent NVARCHAR(255)
);

-- Events and RSVPs
IF OBJECT_ID('dbo.rsvps', 'U') IS NOT NULL DROP TABLE dbo.rsvps;
IF OBJECT_ID('dbo.events', 'U') IS NOT NULL DROP TABLE dbo.events;

CREATE TABLE dbo.events (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    event_date DATETIME2 NOT NULL,
    location NVARCHAR(255),
    visibility NVARCHAR(20) NOT NULL CHECK (visibility IN ('public','member')),
    capacity INT NULL,
    created_by UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.users(id),
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE dbo.rsvps (
    event_id UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.events(id),
    user_id UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.users(id),
    response NVARCHAR(20) NOT NULL DEFAULT 'yes',
    responded_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    PRIMARY KEY (event_id, user_id)
);

-- Documents and newsletters
IF OBJECT_ID('dbo.documents', 'U') IS NOT NULL DROP TABLE dbo.documents;
IF OBJECT_ID('dbo.document_categories', 'U') IS NOT NULL DROP TABLE dbo.document_categories;

CREATE TABLE dbo.document_categories (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    name NVARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE dbo.documents (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    category_id UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.document_categories(id),
    title NVARCHAR(255) NOT NULL,
    file_path NVARCHAR(500) NOT NULL,
    visibility NVARCHAR(20) NOT NULL CHECK (visibility IN ('public','member')),
    uploaded_by UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.users(id),
    uploaded_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

-- Member directory and boats
IF OBJECT_ID('dbo.member_profiles', 'U') IS NOT NULL DROP TABLE dbo.member_profiles;
IF OBJECT_ID('dbo.slips', 'U') IS NOT NULL DROP TABLE dbo.slips;
IF OBJECT_ID('dbo.docks', 'U') IS NOT NULL DROP TABLE dbo.docks;
IF OBJECT_ID('dbo.boats', 'U') IS NOT NULL DROP TABLE dbo.boats;

CREATE TABLE dbo.member_profiles (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    user_id UNIQUEIDENTIFIER NOT NULL UNIQUE REFERENCES dbo.users(id),
    display_name NVARCHAR(200) NOT NULL,
    phone NVARCHAR(50),
    privacy_phone BIT NOT NULL DEFAULT 0,
    privacy_email BIT NOT NULL DEFAULT 0,
    privacy_boat BIT NOT NULL DEFAULT 0
);

CREATE TABLE dbo.docks (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    name NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(255)
);

CREATE TABLE dbo.slips (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    dock_id UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.docks(id),
    slip_code NVARCHAR(20) NOT NULL,
    UNIQUE (dock_id, slip_code)
);

CREATE TABLE dbo.boats (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    owner_id UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.users(id),
    slip_id UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.slips(id),
    name NVARCHAR(200) NOT NULL,
    make NVARCHAR(100),
    model NVARCHAR(100),
    length_ft DECIMAL(5,2),
    UNIQUE (owner_id, slip_id)
);

-- Content
IF OBJECT_ID('dbo.announcements', 'U') IS NOT NULL DROP TABLE dbo.announcements;
IF OBJECT_ID('dbo.pages', 'U') IS NOT NULL DROP TABLE dbo.pages;
IF OBJECT_ID('dbo.content_settings', 'U') IS NOT NULL DROP TABLE dbo.content_settings;
IF OBJECT_ID('dbo.audit_logs', 'U') IS NOT NULL DROP TABLE dbo.audit_logs;

CREATE TABLE dbo.announcements (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    body NVARCHAR(MAX) NOT NULL,
    visibility NVARCHAR(20) NOT NULL CHECK (visibility IN ('public','member')),
    created_by UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.users(id),
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE dbo.pages (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    slug NVARCHAR(100) NOT NULL UNIQUE,
    title NVARCHAR(200) NOT NULL,
    body NVARCHAR(MAX) NOT NULL,
    visibility NVARCHAR(20) NOT NULL CHECK (visibility IN ('public','member')),
    updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE dbo.content_settings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    theme NVARCHAR(100) DEFAULT 'default',
    contact_email NVARCHAR(255),
    updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE dbo.audit_logs (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id UNIQUEIDENTIFIER NULL REFERENCES dbo.users(id),
    action NVARCHAR(200) NOT NULL,
    entity NVARCHAR(100),
    entity_id UNIQUEIDENTIFIER NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE INDEX IX_users_email ON dbo.users(email);
CREATE INDEX IX_events_visibility_date ON dbo.events(visibility, event_date);
CREATE INDEX IX_documents_visibility ON dbo.documents(visibility);
CREATE INDEX IX_member_profiles_user ON dbo.member_profiles(user_id);
CREATE INDEX IX_boats_slip ON dbo.boats(slip_id);
CREATE INDEX IX_rsvps_event ON dbo.rsvps(event_id);
