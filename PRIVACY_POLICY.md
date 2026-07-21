# Privacy Policy — FastMeal

**Last updated:** July 21, 2026  
**Effective date:** July 10, 2026

## 1. Who we are

FastMeal (“**we**”, “**us**”, “**our**”) is a mobile application that helps you generate recipes from ingredients you have at home, manage a virtual fridge, save recipes, and maintain a shopping list.

**Data controller:** Marin Buric  
**Contact:** [infinityfunstudios@gmail.com](mailto:infinityfunstudios@gmail.com)

---

## 2. Scope

This Privacy Policy describes how we collect, use, store, and share information when you use the FastMeal mobile application (“**App**”) and our related API services (“**Services**”).

---

## 3. Summary

- We do **not** require you to create an account or provide your name, email address, or phone number to use the App.
- We assign your device a **random identifier** so we can sync saved recipes and fridge items and enforce daily recipe generation limits.
- When you generate recipes, we send your **ingredient list and preferences**, and — if you choose — an optional **photo of ingredients or your fridge**, to our servers and to **OpenAI** to produce AI-generated recipe suggestions.
- Your **shopping list** is synced to our servers so it can be shared when you join a **family household** with an invite code. Solo users have a private household with only their device.
- We do **not** show advertisements in the App and do **not** sell your personal data.

---

## 4. Information we collect

### 4.1 Information you provide

- **Ingredients** you enter for recipe generation
- **Optional ingredient / fridge photos** you choose to capture with the camera or select from your photo library for recipe generation
- **Diet and lifestyle preferences** (for example: vegetarian, vegan, gluten-free, high protein)
- **Display preferences** such as language and measurement units (metric or imperial)
- **Fridge inventory** (product names, quantities, units, purchase dates, and expiration dates)
- **Recipes you choose to save**
- **Shopping list items** (item names and checked state), synced to your household on our servers

### 4.2 Information collected automatically

- **Device identifier:** A random ID generated on your device and stored locally. It is sent to our servers to associate your saved data and usage limits with your installation. It is **not** your hardware ID, advertising ID, or any identifier tied to your real-world identity.
- **Usage data:** We track how many recipe generations you use per day, linked to your device identifier, to enforce fair-use limits on the free plan.
- **Technical data:** When you use our API, our hosting provider may process standard request metadata (such as IP address, request timestamps, and error logs) for security, reliability, and operation of the Services. We do not use this information to identify you personally.

### 4.3 Information stored only on your device

The following data stays on your device and is not transmitted to our servers:

- App language preference
- Whether you have already been prompted for notification permission
- A local copy of your device identifier
- Temporary copies of photos you select or capture before you submit a recipe request (cleared after successful generation or when you remove the photo)

Shopping list items are stored on our servers (keyed to your household). For solo users, the household contains only your device. If you join a family household with an invite code, shopping list items are shared with other devices in that household. No names, email addresses, or phone numbers are required for family sharing.

Other display settings (such as dietary style, dark mode, and units) are kept in the App while it is running. Relevant preference values are included when you request recipe generation.

### 4.4 Device permissions

- **Notifications (optional):** If you grant permission, the App schedules **local** reminders when fridge products are nearing their expiration date. Notifications are scheduled on your device; we do not use a remote push notification service for this feature.
- **Camera (optional):** If you grant permission, you can take a photo of ingredients or your fridge to help generate recipes. The App only accesses the camera when you choose this feature.
- **Photo library (optional):** If you grant permission, you can select an existing photo of ingredients or your fridge. The App only accesses photos you explicitly choose.

We do **not** access your location, microphone, contacts, SMS, or call logs.

---

## 5. How we use your information

We use the information described above to:

- Generate and display recipe suggestions (including from text ingredients and optional photos you provide)
- Save and sync recipes and fridge products associated with your device
- Sync shopping list items within your household (shared with family members when you join a household via invite code)
- Enforce daily recipe generation limits
- Remember your language and unit preferences
- Schedule local expiration reminders on your device
- Operate, maintain, secure, and improve the Services
- Cache recipe results (for text-based requests) to reduce duplicate AI requests and improve performance

Photos you submit for recipe generation are used only to identify ingredients and generate recipes. We do **not** use them for advertising, facial recognition, or marketing profiling.

We do **not** use your data for advertising, marketing profiling, or selling to data brokers.

---

## 6. Legal bases for processing (EEA and UK)

If you are located in the European Economic Area (EEA) or the United Kingdom, we process personal data on the following legal bases under the General Data Protection Regulation (GDPR):

| Purpose | Legal basis |
|--------|-------------|
| Providing the App and core Services | Performance of a contract / steps taken at your request before entering a contract |
| AI recipe generation (text and optional photos) | Performance of a contract |
| Usage limits, caching, and security | Legitimate interests (operating and protecting the Services) |
| Local expiration notifications | Your consent (device notification permission) |
| Camera and photo library access | Your consent (device permission); photos are processed when you choose to submit them for recipe generation |

You may withdraw consent for notifications, camera, or photo library access at any time through your device settings. Withdrawing consent does not affect the lawfulness of processing based on consent before its withdrawal.

---

## 7. Sharing with third parties

We share data only as necessary to operate the App:

| Recipient | Purpose | Data shared |
|-----------|---------|-------------|
| **OpenAI** | AI-powered recipe generation | Ingredient lists, optional ingredient/fridge photos you submit, dietary preferences, language, and measurement units |
| **MongoDB** (database provider) | Persistent storage | Device identifier, fridge products, saved recipes, shopping list items, usage counts, and cached recipe data (text-based recipe cache; we do not persist submitted photos as a photo library) |
| **Vercel** | API hosting, caching, and infrastructure | Request data processed when you use the App (including image data in transit when you submit a photo for generation) |

These providers process data on our behalf and only for the purposes described in this policy. We do **not** sell, rent, or trade your personal information.

Third-party privacy policies:

- OpenAI: [https://openai.com/policies/privacy-policy](https://openai.com/policies/privacy-policy)
- Vercel: [https://vercel.com/legal/privacy-policy](https://vercel.com/legal/privacy-policy)
- MongoDB: [https://www.mongodb.com/legal/privacy/privacy-policy](https://www.mongodb.com/legal/privacy/privacy-policy)

---

## 8. International data transfers

Our service providers may process data in countries outside your country of residence, including the United States. Where personal data is transferred from the EEA or UK to countries without an adequacy decision, we rely on appropriate safeguards as required by applicable law, such as Standard Contractual Clauses approved by the European Commission.

---

## 9. Data retention

- **Server data** (device identifier, fridge items, saved recipes, shopping list items, and usage counts): retained for as long as you use the App and until we delete it. You may request deletion by contacting us at [infinityfunstudios@gmail.com](mailto:infinityfunstudios@gmail.com). We may need your device identifier to locate and delete server-side data associated with your installation.
- **Recipe cache:** Hashed or normalized **text** recipe inputs and generated results may be cached on our servers for up to **7 days** to improve performance and reduce duplicate AI requests. Recipe requests that include a photo are **not** stored in this recipe cache.
- **Submitted photos:** Transmitted to our servers and to OpenAI only to fulfill the recipe request. We do not keep a persistent gallery of your photos on our servers. Photos may exist briefly in memory or logs as needed to process the request, then are discarded according to normal infrastructure retention for transient request data.
- **On-device data:** Remains on your device until you uninstall the App or clear the App’s storage through your device settings. Selected photos are cleared from App memory after successful generation or when you remove them.

---

## 10. Security

We implement reasonable technical and organizational measures designed to protect your information against unauthorized access, loss, or misuse. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.

---

## 11. Children

FastMeal is not directed at children under the age of 13 (or under 16 where applicable under local law in the EU). We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us at [infinityfunstudios@gmail.com](mailto:infinityfunstudios@gmail.com) and we will take steps to delete that information.

---

## 12. Your rights

Depending on where you live, and in particular if you are in the EEA or UK, you may have the right to:

- **Access** the personal data we hold about you
- **Rectify** inaccurate personal data
- **Erase** your personal data (“right to be forgotten”)
- **Restrict** processing in certain circumstances
- **Object** to processing based on legitimate interests
- **Data portability** — receive your data in a structured, commonly used format
- **Withdraw consent** where processing is based on consent
- **Lodge a complaint** with a supervisory authority

In Croatia, the supervisory authority is the Croatian Personal Data Protection Agency (AZOP): [https://azop.hr](https://azop.hr).

To exercise your rights, email [infinityfunstudios@gmail.com](mailto:infinityfunstudios@gmail.com). We will respond within the timeframes required by applicable law (generally within one month under GDPR). We may ask for your device identifier to help locate server-side data.

---

## 13. Changes to this policy

We may update this Privacy Policy from time to time. When we do, we will revise the “Last updated” date at the top of this document. If changes are material, we may also notify you through the App or other reasonable means. Your continued use of the App after an update constitutes acceptance of the revised policy, to the extent permitted by law.

---

## 14. Contact us

If you have questions about this Privacy Policy or how we handle your data, contact:

**Marin Buric**  
Email: [infinityfunstudios@gmail.com](mailto:infinityfunstudios@gmail.com)
