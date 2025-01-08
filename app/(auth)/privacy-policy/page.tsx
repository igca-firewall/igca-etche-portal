import { MailIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { FaFacebook, FaWhatsapp, FaPhone } from 'react-icons/fa'


const PrivacyPolicy = () => {
  const socialMediaIcons = [
    { id: 1, link: "https://web.facebook.com/christina.emegwa1", icon: <FaFacebook size={18} />, name: "Facebook" },
    { id: 2, link: "https://wa.me/+2348038858159", icon: <FaWhatsapp size={18} />, name: "Whatsapp" },
    { id: 3, link: "tel:+2348038858159", icon: <FaPhone className="rotate-90" size={18} />, name: "Phone" },
    { id: 4, link: "mailto:tinahez3@gmail.com", icon: <MailIcon size={18} />, name: "Gmail" },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 text-gray-700 dark:text-gray-300">
      <h1 className="text-3xl font-semibold">Privacy Policy</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Introduction</h2>
        <p>
          At <strong>Intellectual Giants Christian Academy</strong>, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy outlines the types of personal data we collect, how it is used, and the measures we take to safeguard your information. By using our platform, you agree to the collection and use of information in accordance with this policy.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Information We Collect</h2>
        <p>
          We collect several types of information to provide and improve our services:
        </p>
        <ul className="list-disc pl-5">
          <li><strong>Personal Information:</strong> This includes your name, email address, phone number, and other contact information you provide during registration or profile updates.</li>
          <li><strong>Social Media Transactions:</strong> We track social media interactions, including messages, posts, and comments, to facilitate community engagement and communication.</li>
          <li><strong>Scratch Card Data:</strong> Data related to scratch card transactions, such as card serial numbers, values, and transaction histories, is collected to facilitate redemption and management of cards.</li>
          <li><strong>Role-Based Authentication:</strong> We collect data on your role (student, teacher, administrator) for access control and to provide a personalized experience based on your role in the system.</li>
          <li><strong>Usage Data:</strong> We collect information about your device and how you interact with our platform, including IP addresses, browser type, and pages visited.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
        <p>
          The information we collect is used for the following purposes:
        </p>
        <ul className="list-disc pl-5">
          <li><strong>To Provide Services:</strong> We use your information to deliver and enhance the services you access through our platform, including managing your profile, enabling social interactions, and facilitating scratch card transactions.</li>
          <li><strong>To Personalize Your Experience:</strong> We tailor content, communications, and features based on your role and preferences.</li>
          <li><strong>For Communication:</strong> We may use your contact information to notify you about important updates, security issues, or changes to our policies.</li>
          <li><strong>To Improve Our Platform:</strong> Your usage data helps us understand how users interact with our platform, allowing us to optimize and enhance the experience.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Data Sharing and Disclosure</h2>
        <p>
          We do not share your personal information with third parties except in the following cases:
        </p>
        <ul className="list-disc pl-5">
          <li><strong>With Service Providers:</strong> We may share your data with trusted third-party service providers who assist in operating our platform, such as hosting, payment processing, and data storage.</li>
          <li><strong>For Legal Compliance:</strong> We may disclose your information if required by law or in response to legal requests, such as a subpoena or court order.</li>
          <li><strong>For Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your personal information may be transferred as part of the transaction.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Security of Your Information</h2>
        <p>
          We take reasonable measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include encryption, secure storage, and regular security audits. However, please note that no method of data transmission or storage is 100% secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Rights and Choices</h2>
        <p>
          Depending on your location, you may have the following rights regarding your personal information:
        </p>
        <ul className="list-disc pl-5">
          <li><strong>Access:</strong> You can request access to the personal data we hold about you.</li>
          <li><strong>Correction:</strong> You can request corrections to any inaccurate or incomplete personal data.</li>
          <li><strong>Deletion:</strong> You can request the deletion of your personal information, subject to certain legal exceptions.</li>
          <li><strong>Opt-Out:</strong> You can opt out of certain communications or notifications from us at any time.</li>
          <li><strong>Withdraw Consent:</strong> If we rely on your consent for data processing, you can withdraw it at any time.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and other tracking technologies to enhance your experience on our platform. These technologies help us analyze trends, track user activities, and gather demographic information. You can control cookie settings through your browser, but please note that disabling cookies may impact the functionality of the platform.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically to stay informed about how we protect your information.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
        </p>
        <p>
          <strong>Intellectual Giants Christian Academy</strong><br />
          Email: <a href="mailto:tinahez3@gmail.com" className="text-purple-600">tinahez3@gmail.com</a><br />
          Phone: <a href="tel:+2348038858159" className="text-purple-600">+2348038858159</a>
        </p>

        <p className="mt-4">Follow us on our social media platforms:</p>
        <div className="flex gap-4 items-center cursor-pointer text-center mt-3 mb-3 justify-center">
          {socialMediaIcons.map((media) => (
            <Link href={media.link} key={media.id} title={media.name}>
              <div className="text-xl max-sm:text-2xl lg:p-2 md:p-2 max-sm:p-3 rounded-full  max-sm:border border-gray-400 hover:scale-110 transition-transform duration-300">
                {media.icon}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default PrivacyPolicy
