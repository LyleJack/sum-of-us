DROP TABLE IF EXISTS Members;
CREATE TABLE IF NOT EXISTS Members (MemberId INTEGER PRIMARY KEY, Firstname TEXT, Surname TEXT, Pronouns TEXT, Email TEXT, Phone TEXT, EmergencyName TEXT, EmergencyPhone TEXT, SpecialRequirements TEXT);
-- INSERT INTO Members (MemberID, Firstname, Surname) VALUES (1, 'Alfreds Futterkiste', 'Maria Anders'), (4, 'Around the Horn', 'Thomas Hardy'), (11, 'Bs Beverages', 'Victoria Ashworth'), (13, 'Bs Beverages', 'Random Name');
INSERT INTO Members (MemberID, Firstname, Surname, Email) VALUES (14, 'Tester', 'Testson', "example@example.com")