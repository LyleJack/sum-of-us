## Bugs/Issues

- Login modal text and element sizing
- Desktop:
    - Class schedule image has changed focal point/position
- Narrow (non-mobile) window bugs:
    - nav bar "LOGIN" AND "BOOK NOW" get pushed off-screen
    - Welcome page, meta notes are too high above logo
- Mobile:
    - META text on welcome is too small and poorly positioned, add a clamp
- General:
    - About image is slow to load

New as of 16/06:
- Need a way to handle closing the sidebar when "manage account" is clicked on mobile.
- Size of user account page on mobile
- Login seemed a bit flakey on mobile, didn't redirect properly originally, check the callback maybe
- General pass over all the new code for quality check and simplifications
- Booking on mobile is a bit wide, give padding
- User button (for sign out and manage) is cropped on mobile
- Positioning isn't quite right needs to be rearranged for better aesthetic on mobile and desktop 

- Work out booking flow properly and improve messages etc 

- Cleaning up CSS at some point
- Go through and fix styles to match the figma better

- AI pass at CSS to try and improve responsiveness
- AI QA pass

- Set up prod versions
- More tests
- Look into miniflare mocking



## To-do list:
- Write a proper README
- Sign up confirmation page
- setting up payment system
    - Confirmation page
- Expand test coverage
    - Including mobile friendly tests
- Forgot password flow, partially set up only (needs a please check spam too)
- authenticate API calls using Clerk's JWT in an Authorization header


## Potential extras
- Admin page (potentially a separate website to keep things isolated)
    - setting up class schedule
    - managing users 
    - viewing class signups
    - easy mass e-mails, e.g. sending programs/updates but this could just be a mailing list.
