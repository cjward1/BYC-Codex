-- Seed roles
DECLARE @adminRole UNIQUEIDENTIFIER = NEWID();
DECLARE @memberRole UNIQUEIDENTIFIER = NEWID();
DECLARE @guestRole UNIQUEIDENTIFIER = NEWID();

INSERT INTO dbo.roles (id, name, description) VALUES
(@adminRole, 'admin', 'Administrators with full control'),
(@memberRole, 'member', 'Club members with portal access'),
(@guestRole, 'guest', 'Public visitors');

-- Seed users
DECLARE @adminId UNIQUEIDENTIFIER = NEWID();
DECLARE @memberId UNIQUEIDENTIFIER = NEWID();

INSERT INTO dbo.users (id, email, password_hash, first_name, last_name)
VALUES
(@adminId, 'admin@byc.test', 'HASHED_ADMIN_PASSWORD', 'Ada', 'Admin'),
(@memberId, 'member@byc.test', 'HASHED_MEMBER_PASSWORD', 'Mark', 'Member');

INSERT INTO dbo.user_roles (user_id, role_id) VALUES
(@adminId, @adminRole),
(@adminId, @memberRole),
(@memberId, @memberRole);

-- Seed content
INSERT INTO dbo.pages (slug, title, body, visibility)
VALUES ('home', 'Home', 'Welcome to the BYC community.', 'public'),
       ('about', 'About', 'Learn about our club history and mission.', 'public');

INSERT INTO dbo.announcements (title, body, visibility, created_by)
VALUES ('Safety Reminder', 'Please wear life jackets on the docks.', 'public', @adminId),
       ('Work Party', 'Volunteers needed this Saturday.', 'member', @adminId);

-- Event seed data
INSERT INTO dbo.events (title, description, event_date, location, visibility, capacity, created_by)
VALUES ('Opening Day', 'Kick off the boating season with a community potluck.', '2025-05-15', 'Clubhouse Lawn', 'public', 100, @adminId),
       ('Member Regatta', 'Friendly race across the bay.', '2025-06-10', 'Harbor', 'member', 40, @adminId);

INSERT INTO dbo.rsvps (event_id, user_id, response)
SELECT id, @memberId, 'yes' FROM dbo.events WHERE title = 'Opening Day';

-- Documents and categories
DECLARE @newsletterCat UNIQUEIDENTIFIER = NEWID();
DECLARE @documentCat UNIQUEIDENTIFIER = NEWID();
INSERT INTO dbo.document_categories (id, name) VALUES
(@newsletterCat, 'newsletter'),
(@documentCat, 'document');

INSERT INTO dbo.documents (category_id, title, file_path, visibility, uploaded_by)
VALUES (@newsletterCat, 'March Newsletter', '/uploads/march-newsletter.pdf', 'member', @adminId),
       (@documentCat, 'Visitor Guide', '/uploads/visitor-guide.pdf', 'public', @adminId);

-- Docks and slips
DECLARE @dockA UNIQUEIDENTIFIER = NEWID();
DECLARE @dockB UNIQUEIDENTIFIER = NEWID();
INSERT INTO dbo.docks (id, name, description) VALUES
(@dockA, 'A', 'Main front dock'),
(@dockB, 'B', 'North dock');

DECLARE @slipA1 UNIQUEIDENTIFIER = NEWID();
DECLARE @slipB4 UNIQUEIDENTIFIER = NEWID();
INSERT INTO dbo.slips (id, dock_id, slip_code) VALUES
(@slipA1, @dockA, 'A1'),
(NEWID(), @dockA, 'A2'),
(NEWID(), @dockA, 'A3'),
(NEWID(), @dockA, 'A4'),
(@slipB4, @dockB, 'B4');

INSERT INTO dbo.boats (owner_id, slip_id, name, make, model, length_ft)
VALUES (@adminId, @slipA1, 'Sea Breeze', 'Beneteau', 'Oceanis', 34.5),
       (@memberId, @slipB4, 'Wind Runner', 'Catalina', '320', 32.0);

-- Profiles
INSERT INTO dbo.member_profiles (user_id, display_name, phone, privacy_phone, privacy_email, privacy_boat)
VALUES (@adminId, 'Ada Admin', '555-0001', 0, 0, 0),
       (@memberId, 'Mark Member', '555-0002', 1, 0, 0);

-- Content settings
INSERT INTO dbo.content_settings (theme, contact_email)
VALUES ('byc-default', 'info@byc.test');
