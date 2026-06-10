## Bugs/Issues
- ~~Text styles (see Google Doc)~~
- ~~Login modal text and element sizing~~
- Desktop:
    - Class schedule image has changed focal point/position
- Narrow (non-mobile) window bugs:
    - nav bar "LOGIN" AND "BOOK NOW" get pushed off-screen
    - Welcome page, meta notes are too high above logo
- Mobile:
    - META text on welcome is too small and poorly positioned, add a clamp
    - Mobile sidebar logo has been replaced with full logo and is in line with the buttons
    - Login modal text is weirdly spaced and too small (same for sign up)
- General:
    - About image is slow to load

## To-do list:
- Write a proper README
- Log out modal
- Sign up confirmation page
- Booking flow
    - Select class/date to book
    - Payment options (if !subsciption)
        - including setting up payment system
    - Confirmation page
- User Accounts page
- User Accounts button
- Expand test coverage
    - Including mobile friendly tests
- Move user login/authentication outside of AWS 
- Look into benefits of IaC (potentially add in terraform after gaining more experience at work)
- Forgot password flow


## Potential extras
- Admin page (potentially a separate website to keep things isolated)
    - setting up class schedule
    - managing users 
    - viewing class signups
    - easy mass e-mails, e.g. sending programs/updates but this could just be a mailing list.
