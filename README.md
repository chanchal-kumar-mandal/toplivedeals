# TopLiveDeals

**Domain:** [www.toplivedeals.com](https://www.toplivedeals.com) (Planned)

---

## Project Overview

TopLiveDeals is a dynamic web application designed to be your ultimate destination for discovering the latest and greatest discounted products across various major e-commerce platforms in India. It aggregates deals from popular sites like Amazon, Flipkart, Myntra, Meesho, Ajio, and more, presenting them in an easy-to-browse format. Each product listing comes with integrated affiliate links, facilitating seamless shopping for users and enabling commission earnings.

---

## Live App: https://chanchal-kumar-mandal.github.io/toplivedeals/

## Demo Screenshots
# Desktop
![image](https://github.com/user-attachments/assets/c1dcd537-090a-4c12-9718-5d291c7ff952)
![image](https://github.com/user-attachments/assets/6e9f473f-bb0a-4592-807e-41ffb831ced5)
![image](https://github.com/user-attachments/assets/19c95a20-1f1f-4bb5-bf94-cdd268f30a04)

# Mobile
![image](https://github.com/user-attachments/assets/2afc6030-a781-4c3e-80d6-19bb2b5bcde7)
![image](https://github.com/user-attachments/assets/f7c851fb-9157-4c8a-b6da-ef0e2dcb055a)

# Firestore Database Data
![image](https://github.com/user-attachments/assets/60ee58fe-7462-4d16-811f-27af2cecab03)

![learningboxpro-img-users-data-in-firestore-database-2](https://github.com/user-attachments/assets/b5a7cabb-a3f1-4a5e-94f8-cc66bb0522f9)

---

## Version 1: Key Features & Functions

The initial version of TopLiveDeals focuses on delivering a streamlined deal discovery experience:

* **Comprehensive Product Display:**
    * Showcases current discounted products sourced from leading e-commerce applications including Amazon, Flipkart, Myntra, Meesho, Ajio, and others.
* **Intuitive Navigation Menu:**
    * Features a clear menu with sections for "Live Deals," "Top Deals," "Coupons," and a "Search Bar" for quick access.
* **Advanced Filter Options:**
    * Allows users to filter products by `Category` (e.g., Electronics, Fashion, Home, Sports, Kitchen, Automotive, Health).
    * Enables filtering by `Application` (e.g., Amazon, Flipkart, Myntra, Meesho, Ajio).
* **Rich Product Display Details:**
    * Each product card prominently displays:
        * Product image carousel for multiple views.
        * Clear Product Title.
        * Discount Percentage (%).
        * Price (both "before" and "after" discount).
        * A prominent "Buy Now" button.
        * Applicable coupon codes, if available.
        * Product Rating.
* **Affiliate Integration:**
    * Clicking the "Buy Now" button seamlessly opens the product page in a new browser tab, utilizing your integrated affiliate tracking link.
* **Data Management (Firebase Firestore):**
    * All e-commerce product details are managed directly within the Firebase Firestore database, ensuring real-time updates and efficient data handling. (Previously, there was a plan to use a CSV file for initial data generation, with fields like `application`, `category`, `id`, `images`, `title`, `discount`, `priceBefore`, `priceAfter`, `coupon`, `rating`.)

---

## Current Market Products (Competitors/Inspiration)

* [Deals Magnet](https://www.dealsmagnet.com/)
* [IndiaFreeStuff](https://www.indiafreestuff.in/)
* [CouponDunia](https://www.coupondunia.in/)

---

## Version 2: Future Enhancements (Planned Features)

The roadmap for TopLiveDeals includes exciting future developments:

* **Expanded E-commerce Integrations:**
    * Integration with additional popular e-commerce applications.
* **Personalized Notifications:**
    * Users will receive notifications for better discounts on their favorite products.
* **Automated Coupon Application/Suggestions:**
    * Intelligent features for automatically applying coupons or suggesting relevant ones.
* **Product Price Comparison:**
    * Ability for users to compare product prices across different integrated applications.
* **User Login & Wishlist:**
    * Implementation of user authentication, allowing for personalized wishlists and preferences.
* **Referral Program:**
    * Introduction of a referral program to incentivize user growth.

---

## Technical Details

This project is built using modern web technologies to provide a fast and responsive user experience.

* **Frontend:**
    * **React:** A declarative, component-based JavaScript library for building user interfaces.
    * **Bootstrap:** A powerful, open-source front-end framework for responsive web development.
    * **React Icons:** A library providing a wide variety of customizable SVG icons.
    * **Vite:** A fast build tool and development server for modern web projects.
    * *(Note: Avoids TypeScript for this version).*
* **Backend/Database:**
    * **Firebase Firestore:** A flexible, scalable NoSQL cloud database for storing and synchronizing data in real-time.
    * **Firebase Authentication:** For user registration and login management.
    * **Firebase Hosting:** For deploying the frontend application.

### Product Design Inspiration

The visual design and user experience draw inspiration from these Codepen examples:

* [Card Design by @nodws](https://codepen.io/nodws/pen/gbpLqqg)
* [Product Card by @piyush-608](https://codepen.io/piyush-608/pen/azoZENE)
* [Product Card UI by @trixxx_galaxy](https://codepen.io/trixxx_galaxy/pen/ExqLoJB)

---

## Getting Started (Local Development)

Follow these steps to set up and run the project on your local machine:

1.  **Create the Vite project (if starting fresh):**
    ```bash
    npm create vite@latest toplivedeals -- --template react
    ```

2.  **Navigate into your new project directory:**
    ```bash
    cd toplivedeals
    ```

3.  **Install core project dependencies:**
    ```bash
    npm install
    ```

4.  **Install additional frontend libraries:**
    ```bash
    npm install bootstrap react-icons react-router-dom
    # Note: swiper and papaparse are not currently used in the provided code,
    # but keep this command if you plan to use them later.
    # npm install swiper papaparse
    ```

5.  **Install Firebase tools globally (if not already done):**
    ```bash
    npm install -g firebase-tools
    ```

6.  **Login to Firebase:**
    ```bash
    firebase login
    ```

7.  **Initialize Firebase in your project:**
    ```bash
    firebase init
    ```
    * During initialization, select "Firestore," "Hosting," and "Functions" (if you plan to use them for more advanced features like notifications or auto coupon apply).
    * When prompted for a Firebase project, select your existing `toplivedeals` project.
    * Follow the prompts to set up `firestore.rules`, `firestore.indexes`, and the `public` directory for hosting (usually `dist` for Vite).

8.  **Use your specific Firebase project:**
    ```bash
    firebase use toplivedeals
    ```

9.  **Install Firebase SDK in your project (if not already done for auth or data store):**
    ```bash
    npm install firebase
    ```

10. **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start your React application locally, typically at `http://localhost:5173`.

---

## Deployment (to GitHub Pages)

To deploy your application to GitHub Pages, follow these steps (assuming you've followed the GitHub Pages configuration instructions provided earlier, including `homepage` in `package.json` and `base` in `vite.config.js`):

1.  **Build and Deploy:**
    ```bash
    npm run deploy
    ```
    This command compiles your React app for production and pushes it to the `gh-pages` branch of your GitHub repository.

2.  **Enable GitHub Pages:**
    * Go to your GitHub repository on GitHub.com.
    * Navigate to **Settings > Pages**.
    * Under "Branch," select the `gh-pages` branch and click "Save."
    * Your live site URL will be displayed there once deployed (e.g., `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`).


### Set up Github Hosting 
1. Create a GitHub Repository
	Go to GitHub and create a new repository for your project.
	Initialize the repository with a README if you like.
2. Push Your React App to GitHub (if not already done)

	git init  # Initialize git if not done already
	git remote add origin https://github.com/username/repository-name.git  # Replace with your repository URL
	git add .
	git commit -m "Initial commit"
	git push -u origin main  # Push to the main branch
3. Install gh-pages Package
	$npm install gh-pages --save-dev
4. Add Scripts to package.json
	Open package.json and add the following:
	"homepage": "https://yourusername.github.io/repository-name"

	Update the scripts section in package.json to include deployment commands.
	"scripts": {
     //add these 2 lines
	  "predeploy": "npm run build",
	  "deploy": "gh-pages -d dist"
	}
    Add base: '/toplivedeals/', after plugins: [react()], in vite.config.js
5. Build and Deploy Your React App
	$npm run build
	$npm run deploy
6. Enable GitHub Pages in Repository Settings
	Go to your repository on GitHub.
	Click on Settings (on the right side).
	Scroll down to the Pages section in the left sidebar.
	Under Source, select gh-pages branch.
	Click Save.
	Your site will now be available at: arduino
	Copy code
	https://username.github.io/repository-name/
7. Access Your Hosted React App
	Your React app will be live at https://yourusername.github.io/repository-name/.


---

## Gemini AI Help

This project was developed with assistance from Gemini AI. You can reference the conversation here:

[Gemini Chat Link](https://gemini.google.com/app/22e0682cbae2d586?hl=en-IN)

---

## License

*(Consider adding a license here, e.g., MIT License, if you wish to allow others to use, modify, and distribute your code.)*