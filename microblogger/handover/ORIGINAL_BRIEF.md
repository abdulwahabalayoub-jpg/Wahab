# Build a Microblogger Management & Restaurant Booking Platform

## 1. Project Overview

Build a modern web application called **Microblogger Management System**.

The platform is designed for an F&B company that manages multiple restaurant brands and works with microbloggers and food influencers.

Currently, restaurants receive numerous Instagram messages from microbloggers asking to collaborate. The marketing team manually responds to these messages, collects their information, approves them, invites them to restaurants, coordinates dates and manages bookings.

The purpose of this platform is to centralize and automate this entire process.

The platform should allow the marketing team to manage a database of approved microbloggers, organize them into groups, create restaurant invitation campaigns, send invitations, and allow bloggers to reserve available restaurant visits through their personal accounts.

**The most important objective is to eliminate manual communication and booking coordination.**

This is a centralized platform for multiple restaurants, not a separate platform for each restaurant.

For the first version, create a fully interactive prototype using realistic sample data. Simulate external integrations where necessary. Structure the application so real integrations can be added later.

---

# 2. User Types

There are two main user types:

### A. Administrator / Marketing Team

The administrator has access to the main dashboard and controls the entire platform.

Administrators can:
- View and manage all registered microbloggers.
- Approve or reject applications.
- Create and manage blogger groups.
- Create restaurant campaigns.
- Select which bloggers receive invitations.
- Manage booking availability.
- Monitor reservations.
- Manage blogger accounts.
- View campaign history and attendance.

### B. Microblogger

Microbloggers have access to a separate, simplified portal.

They can:
- Register their information.
- Access their personal account after approval.
- View available restaurant invitations.
- Browse available dates and time slots.
- Reserve a restaurant visit.
- View upcoming reservations.
- Cancel reservations, subject to the campaign's cancellation rules.
- View their previous visits.

Microbloggers must never have access to the administrator dashboard or other bloggers' private information.

---

# 3. Blogger Registration Page

Create a public registration page that the marketing team can share with potential microbloggers.

The registration form should collect:

**Personal Information**
- Full name.
- Phone number with country code.

**Social Media Accounts**

Instagram should be the primary social media platform.

The form should include:
- Instagram username.
- Instagram profile URL.

There should be an "Add Another Platform" button.

When clicked, the blogger can select another platform:
- TikTok.
- Snapchat.
- YouTube.
- X.
- Other.

Each additional platform should have its own username and profile URL fields.

Allow bloggers to add multiple platforms.

Include a submit button.

After submission, display a confirmation message explaining that their application has been received and is awaiting review.

Do not ask for engagement rates, follower counts, analytics or performance information in this initial version.

---

# 4. Automatic Username Generation

Every registered blogger must receive a unique system-generated username.

The username must be generated automatically by the system, not chosen by the blogger.

Example:

Full name: Ahmed Al Salem

Generated username: ahmed_4821

Requirements:
- Automatically generate a username when the application is created.
- Check the database to ensure the username is unique.
- If the username already exists, generate another one.
- Never allow duplicate usernames.
- Keep the username permanently associated with the blogger's profile.
- Generate a separate unique internal account ID.

The system username is primarily for internal identification. Bloggers do not need to manually create usernames or passwords during registration.

---

# 5. Administrator Dashboard

Create a professional central dashboard.

The dashboard should have a clean sidebar navigation with the following sections:

1. Overview
2. Microbloggers
3. Blogger Groups
4. Campaigns
5. Reservations
6. Restaurants
7. Settings

### Overview Dashboard

Display key statistics:

- Total registered bloggers.
- Pending applications.
- Approved bloggers.
- Active bloggers.
- Active campaigns.
- Total confirmed reservations.
- Upcoming restaurant visits.

Include a section showing recent registrations and upcoming campaigns.

Use realistic sample data.

### Microblogger Management

Create a searchable and filterable table displaying:

- Full name.
- System username.
- Phone number.
- Instagram account.
- Other social media accounts.
- Registration date.
- Approval status.

Each blogger should have a detailed profile page.

The administrator should be able to:
- Open their profile.
- View all submitted social media accounts.
- Approve applications.
- Reject applications.
- Suspend accounts.
- Reactivate accounts.
- Edit information.
- View their reservation history.
- View their attendance history.

Application statuses should include:

- Pending.
- Approved.
- Rejected.
- Suspended.

---

# 6. Blogger Groups / Lists

The administrator must be able to organize approved bloggers into different groups.

For example:

- General Microbloggers.
- Food Bloggers.
- Lifestyle Bloggers.
- Regular Collaborators.
- Priority Bloggers.

These are customizable groups.

Requirements:

- Create new groups.
- Rename groups.
- Delete groups.
- Add bloggers to groups.
- Remove bloggers from groups.
- Add one blogger to multiple groups.
- Select entire groups when creating campaigns.
- Manually select individual bloggers.

A blogger can belong to multiple groups.

The group system is important because the marketing team should be able to target specific bloggers instead of inviting everyone.

---

# 7. Personal Blogger Accounts and Access

Once an administrator approves a blogger, the system should allow the administrator to activate their account and issue a personal access link.

The blogger receives their personal link through WhatsApp.

Each link must be uniquely associated with the approved blogger's account.

### Security Requirements

Prevent bloggers from sharing their links with friends or family to obtain additional bookings.

Implement:

- Unique personal access links.
- Phone number verification through OTP.
- Account identity linked to the originally registered phone number.
- One account per approved blogger.
- No public registration through personal invitation links.
- Ability for administrators to revoke access.
- Ability to suspend an account.

If someone else opens a blogger's link, they must still verify the registered phone number before accessing the account.

The system must always know which approved blogger is making a reservation.

---

# 8. Restaurant Management

Create a restaurant management section.

The administrator can add and manage multiple restaurant brands.

For the prototype, use these sample restaurants:

- Solia
- Khaneen
- Delfino
- Danish Bakery
- Häagen-Dazs
- illy
- Sutis

Each restaurant should have:

- Restaurant name.
- Logo or image.
- Description.
- Location.
- Active/inactive status.

Administrators should be able to add, edit and deactivate restaurants.

The system must support an unlimited number of restaurant brands.

---

# 9. Campaign Creation

This is one of the most important features of the platform.

The administrator should be able to create restaurant invitation campaigns.

Create a simple campaign creation workflow.

### Campaign Information

The administrator selects:

- Campaign name.
- Restaurant.
- Visit date.
- Start time.
- End time.
- Total available blogger spots.
- Number of bloggers to invite.
- Target blogger group or groups.
- Option to manually select individual bloggers.
- Optional campaign description.
- Optional instructions for bloggers.

Example campaign:

Restaurant: Solia

Date: 25 November 2026

Available time: 1 PM – 4 PM

Maximum bookings: 10 bloggers

Target audience: Approved Microbloggers.

### Campaign Capacity

The administrator determines the number of available spots.

For example:

10 available spots.

The system sends invitations to 100 selected bloggers.

Only the first 10 successful reservations can be confirmed.

The remaining bloggers should see that the campaign is fully booked.

The administrator must be able to:
- Edit campaign details.
- Increase or decrease capacity.
- Pause a campaign.
- Close a campaign.
- Cancel a campaign.
- View all invited bloggers.
- View confirmed bookings.
- View remaining spots.

If the campaign is paused or closed, no additional bookings should be allowed.

---

# 10. Blogger Invitation System

Once a campaign is created, the administrator should be able to launch it.

The system should prepare invitations for the selected bloggers.

Each invitation must contain that blogger's personal access link.

### Invitation Message Example

"Hi Ahmed!

We'd love to invite you to visit Solia.

We have an upcoming microblogger invitation available.

You can access your personal invitation page through the link below, where you can view available restaurants, dates and reserve your visit.

Looking forward to seeing you!"

The administrator should be able to customize invitation messages.

For the prototype, simulate the sending process and show:
- Invitations prepared.
- Invitations sent.
- Delivery status.
- Invitation date.
- Blogger recipient.

Design the system so WhatsApp Business Platform integration can be implemented later.

Do not rely on unofficial WhatsApp automation.

---

# 11. Blogger Booking Portal

This is the second major interface of the application.

Create a separate, mobile-first portal for approved bloggers.

When they log in through their personal access link and verify their phone number, they should see their available invitations.

### Available Invitations

Display restaurant invitation cards.

Each card should show:

- Restaurant name.
- Restaurant image.
- Visit date.
- Available time.
- Number of remaining spots.
- Short description.
- Booking button.

Example:

SOLIA

25 November 2026

1 PM – 4 PM

7 of 10 spots remaining.

Button: Reserve Your Spot.

Another example:

KHANEEN

26 November 2026

10 AM – 1 PM

3 of 5 spots remaining.

Button: Reserve Your Spot.

If a campaign is full, display:

FULLY BOOKED.

The blogger should not be able to reserve a full campaign.

### Booking Confirmation

When a blogger selects an available invitation:

1. Display the selected restaurant and date.
2. Ask them to confirm their reservation.
3. Process the booking.
4. Immediately reserve one available spot.
5. Update the campaign's remaining capacity.
6. Display a booking confirmation.

The booking should be associated with the blogger's existing account.

### Important Booking Logic

The system must prevent double bookings and overbooking.

If two bloggers attempt to reserve the final available spot simultaneously, only one reservation should succeed.

Capacity must be updated immediately and reliably.

One blogger should not be able to reserve the same campaign multiple times.

---

# 12. Blogger Personal Dashboard

Once logged in, bloggers should see a simple personal dashboard.

Include:

- Available invitations.
- Upcoming reservations.
- Previous visits.
- Cancelled reservations.
- Personal account information.

Each confirmed reservation should display:

- Restaurant.
- Date.
- Time.
- Booking status.
- Booking reference.

Keep this interface extremely simple. Bloggers should be able to find and reserve an invitation without needing instructions.

---

# 13. Reservation Management Dashboard

Create a dedicated administrator reservation section.

Display all reservations in a searchable table.

Columns:

- Blogger name.
- Instagram account.
- Restaurant.
- Campaign.
- Visit date.
- Visit time.
- Booking date.
- Reservation status.
- Attendance status.

Reservation statuses:

- Confirmed.
- Cancelled.
- Completed.
- No-show.

Attendance should be tracked separately from reservation status.

Administrators should be able to:
- View reservation details.
- Cancel reservations.
- Change reservation details.
- Mark attendance.
- Mark a blogger as a no-show.
- View a blogger's previous reservations.

---

# 14. Notifications and Reminders

Design the notification system so it can eventually automate:

- Application approval messages.
- Application rejection messages.
- Personal account access messages.
- Campaign invitations.
- Booking confirmations.
- Booking cancellation notifications.
- Visit reminders.
- Campaign updates.

For the prototype, notifications can be simulated within the application.

Plan for future WhatsApp Business Platform integration.

---

# 15. Design and User Experience

The application should look like a premium, modern SaaS management platform.

### Administrator Interface

Design direction:
- Clean.
- Minimal.
- Professional.
- Modern.
- Spacious.
- Easy to navigate.
- Data-focused without looking complicated.

Use:
- White or very light neutral backgrounds.
- Dark charcoal text.
- Subtle borders.
- Soft grey secondary elements.
- Clear typography.
- Simple icons.
- Clean tables.
- Modern cards.
- Consistent spacing.

Avoid:
- Excessive gradients.
- Bright colours.
- Overly decorative elements.
- Unnecessary animations.
- Cluttered dashboards.
- Oversized statistics.

Use a collapsible sidebar.

The administrator interface should feel like a serious business management tool.

### Blogger Interface

The blogger portal should be different.

Make it:
- Mobile-first.
- Simple.
- Visually appealing.
- Easy to understand.
- Focused on restaurant invitations and reservations.

Use restaurant photography and clean invitation cards.

The blogger should not feel like they are using complicated business software.

---

# 16. Technical Requirements

Build this as a responsive web application.

Use a proper database structure.

Suggested technology:
- React.
- TypeScript.
- Tailwind CSS.
- Supabase for database, authentication and backend functionality.

Create appropriate database tables for:

1. Administrators.
2. Bloggers.
3. Social media accounts.
4. Blogger groups.
5. Blogger group memberships.
6. Restaurants.
7. Campaigns.
8. Campaign invitations.
9. Reservations.
10. Notifications.
11. Attendance records.

Use unique constraints for:
- Blogger account IDs.
- System usernames.
- Reservation IDs.
- Invitation tokens.

Implement proper access permissions.

Administrators can manage all records.

Bloggers can only access their own accounts, invitations and reservations.

Use secure database access rules.

Do not expose private blogger information to other bloggers.

---

# 17. Prototype Requirements

This first version is intended to demonstrate the concept to management.

It must be an interactive prototype, not simply a visual presentation.

Use realistic sample data.

Include:
- At least 20 sample bloggers.
- Several blogger groups.
- At least 7 sample restaurants.
- Multiple active and completed campaigns.
- Sample invitations.
- Sample reservations.
- Different booking statuses.

Make all the main interactions functional.

For example:
- Approving a blogger changes their status.
- Creating a group saves the group.
- Adding bloggers to a group updates membership.
- Creating a campaign adds it to the campaigns dashboard.
- Launching a campaign generates sample invitations.
- Making a reservation reduces available capacity.
- Cancelling a reservation restores capacity.
- Closing a campaign prevents further bookings.

If an external service is not connected, simulate its functionality and clearly indicate that it is a demonstration.

Do not pretend WhatsApp messages have actually been sent.

---

# 18. Future Development (Do Not Build Yet)

Keep the architecture flexible so these features can be added later:

- Instagram engagement rate tracking.
- Follower count tracking.
- Social media analytics.
- Blogger performance scoring.
- Campaign performance reports.
- Automated blogger recommendations.
- Advanced audience segmentation.
- Automatic WhatsApp communication.
- Restaurant-specific booking capacity and table management.
- Automated attendance reminders.
- Blogger content submission and verification.
- Marketing ROI reporting.

Do not spend time implementing these features in the first prototype.

---

# FINAL INSTRUCTION

Build the complete application with two distinct experiences:

1. An administrator dashboard for managing the entire microblogger database, restaurants, campaigns, invitations and reservations.
2. A private blogger portal for approved bloggers to access invitations and reserve restaurant visits.

Prioritize the complete workflow from registration to approval to invitation to booking to attendance.

The most important functionality is the private identity-based booking system, the ability to manage multiple restaurants from one dashboard, and real-time reservation capacity management.

Start by building the core application with a polished interface, functional navigation, realistic sample data and working interactions.

Do not build just a landing page. Build the actual application prototype.